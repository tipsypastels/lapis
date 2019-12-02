// SOOOO much koa
import Koa from 'koa';
import Router from 'koa-router';
import hbs from 'koa-hbs-renderer';
import serve from 'koa-static';
import mount from 'koa-mount';
import body from 'koa-body';
import jwt from 'koa-jwt';
import sqlite3 from 'sqlite3-promisify';
import migration from './migration';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = new Koa();
const router = new Router();
const database = new sqlite3('./database.sqlite');

app.use(body({
  multipart: true,
  urlencoded: true,
}));

app.use(hbs({
  defaultLayout: 'application',
  contentTag: 'body',
  paths: {
    views: __dirname + '/views',
    layouts: __dirname + '/views/layouts',
  }
}));

app.use(mount('/static', serve('./static')));

app.use((ctx, next) => {
  return next().catch(err => {
    if (401 === err.status) {
      ctx.redirect('/login');
    } else {
      throw err;
    }
  });
});

app.use(async (ctx, next) => {
  const login = ctx.cookies.get('lapisLogin');
  if (login) {
    const session = jsonwebtoken.verify(login, 'whatever');
    if (!session) {
      return;
    }

    const user = await database.get(`
      select 
        id, name, role, role = 'admin' as isAdmin 
      from 
        users 
      where 
        id = ?
    `, [session.id]);

    ctx.user = user;
  }

  return await next();
});

app.use(jwt({ secret: 'whatever', cookie: 'lapisLogin' })
  .unless({ path: [/^\/(?:login|static)/] }));

app.use((ctx, next) => {
  console.log(`${ctx.method} ${ctx.path}`);
  return next();
});

router.get('/login', async ctx => {
  if (ctx.user) {
    ctx.redirect('/');
  }

  await ctx.render('login', { title: 'Authorization Required' });
});

router.post('/login', async ctx => {
  const { name, password } = ctx.request.body;

  if (!name || !password) {
    return ctx.auth = 401;
  }

  const user = await database.get(`
    select id, passwordHash from users where name = ?
  `, [name]);

  if (!user) {
    return ctx.auth = 401;
  }

  const authenticated = await bcrypt.compare(password, user.passwordHash);
  console.log({ user, authenticated })
  if (!authenticated) {
    return ctx.auth = 401;
  }

  const token = jsonwebtoken.sign({ id: user.id }, 'whatever');
  ctx.cookies.set('lapisLogin', token);
  ctx.redirect('/');
});

router.get('/logout', async ctx => {
  ctx.cookies.set('lapisLogin', null);
  ctx.redirect('/login');
});

router.get('/', async ctx => {
  const artifacts = await database.all(`
    SELECT * FROM artifacts ORDER BY dateModified DESC
  `);

  await ctx.render('artifacts', { 
    artifacts, 
    title: 'Lapis Philosophae',
    user: ctx.user,
  });
});

router.get('/artifacts', ctx => ctx.redirect('/'));

router.post('/artifactsWithSafety', async ctx => {
  const { safetyLevel } = ctx.request.body;

  if (safetyLevel === 'all') {
    return ctx.redirect('/');
  }

  const artifacts = await database.all(`
    SELECT * FROM artifacts 
    WHERE safetyLevel = ? 
    ORDER BY dateModified DESC
  `, [safetyLevel]);

  await ctx.render('artifacts', {
    artifacts,
    title: `Artifacts - ${safetyLevel}`,
    user: ctx.user,
    withSafety: true,
  })
});

router.get('/artifacts/new', async ctx => {
  await ctx.render('artifactsNew', { 
    title: 'Create Artifact',
    user: ctx.user 
  });
});

router.get('/artifacts/:id', async ctx => {
  const { id } = ctx.params;
  const artifact = await database.get(`
    SELECT 
      artifacts.*, 
      COUNT(experiments.artifactID) as experimentsCount,
      COUNT(craftable.artifactID) > 0 as craftable
    FROM 
      artifacts
    LEFT JOIN
      experiments
    ON
      experiments.artifactID = artifacts.id
    LEFT JOIN
      craftable
    ON
      craftable.artifactID = artifacts.id
    WHERE 
      artifacts.id = ?
  `, [id]);

  if (!artifact || !artifact.id) {
    return ctx.status = 404;
  }

  const authorNames = (await database.all(`
    SELECT 
      users.name 
    FROM 
      authoredBy
    LEFT JOIN
      users
    ON
      authoredBy.userID = users.id 
    WHERE 
      artifactID = ?
  `, [artifact.id])).map(u => u.name).join(', ');

  await ctx.render('artifact', {
    artifact,
    authorNames,
    title: artifact.name,
    user: ctx.user,
  });
});

router.post('/artifacts', async ctx => {
  const { 
    name, 
    description, 
    usage, 
    safetyLevel,
    ingredients,
    instructions,
    collaborators
  } = ctx.request.body;

  await database.run(`
    INSERT INTO
      artifacts(name, description, usage, safetyLevel)
    VALUES
      (?, ?, ?, ?)
  `, [name, description, usage, safetyLevel]);

  const { id } = await database
    .get(`select last_insert_rowid() as id`);

  if (instructions && ingredients) {
    await database.run(`
      INSERT INTO Craftable VALUES (?, ?, ?)
    `, [id, instructions, ingredients]);
  }

  const runners = new Set([ctx.user.id]);

  if (collaborators) {
    for (const name of collaborators.trim().split(/\s*,\s*/)) {
      const user = await database.get(`
        SELECT id from users where name = ?
      `, [name]);

      if (!user) {
        continue;
      }

      runners.add(user.id);
    }
  }

  for (const userID of runners.values()) {
    await database.run(`
      INSERT INTO authoredBy VALUES (?, ?)
    `, [id, userID]);
  }

  ctx.redirect(`/artifacts/${id}`);
  ctx.status = 301;
});

router.get('/artifacts/:artifactID/crafting', async ctx => {
  const { artifactID } = ctx.params;
  const artifact = await database.get(`
    SELECT 
      artifacts.*,
      craftable.*
    FROM
      artifacts
    LEFT JOIN
      craftable
    ON
      artifacts.id = craftable.artifactID
    WHERE
      artifacts.id = ?
  `, [artifactID]);

  if (!artifact || !artifact.id) {
    return ctx.status = 404;
  }

  await ctx.render('crafting', {
    artifact,
    title: `${artifact.name} - Crafting`,
    user: ctx.user,
  });
});

router.get('/artifacts/:artifactID/experiments', async ctx => {
  const { artifactID } = ctx.params;
  const artifact = await database.get(`
    SELECT * FROM artifacts WHERE id = ?
  `, [artifactID]);

  if (!artifact || !artifact.id) {
    ctx.status = 404;
  }

  const experiments = await database.all(`
    SELECT 
      experiments.*, 
      experiments.endDate IS NULL OR experiments.endDate = "" as ongoing
    FROM
      experiments
    WHERE
      experiments.artifactID = ?
    ORDER BY
      experiments.startDate DESC
  `, [artifactID]);

  for (let experiment of experiments) {
    experiment.testers = await database.all(`
      SELECT * FROM testersHave WHERE experimentID = ?
    `, [experiment.id]);

    experiment.runners = (await database.all(`
      SELECT
        users.name
      FROM
        run
      LEFT JOIN
        users
      ON
        run.userID = users.id
      WHERE
        run.experimentID = ?
    `, [experiment.id])).map(n => n.name)
                        .join(', ');
  }

  await ctx.render('experiments', {
    artifact,
    experiments,
    title: `${artifact.name} - Experiments`,
    user: ctx.user,
  });
});

router.get('/artifacts/:id/experiments/new', async ctx => {
  const { id } = ctx.params;
  const artifact = await database.get(`
    SELECT * FROM artifacts WHERE id = ?
  `, [id]);

  if (!artifact || !artifact.id) {
    return ctx.status = 404;
  }

  await ctx.render('experimentsNew', {
    artifact,
    title: `${artifact.name} - Add Experiment`,
    user: ctx.user,
  });
});

router.post('/artifacts/:artifactID/experiments', async ctx => {
  const { artifactID } = ctx.params;
  const { 
    research, 
    description, 
    startDate, 
    endDate 
  } = ctx.request.body;
  
  await database.run(`
  INSERT INTO 
    experiments(research, description, startDate, endDate, artifactID) 
  VALUES 
    (?, ?, ?, ?, ?)
  `, [research, description, startDate, endDate, artifactID]);
  
  const { id } = await database
  .get(`select last_insert_rowid() as id`);
  
  await database.run(`
  INSERT INTO performedOn(artifactID, experimentID) VALUES (?, ?)
  `, [artifactID, id]);
  
  const runners = new Set([ctx.user.id]);

  let { collaborators } = ctx.request.body;
  if (collaborators) {
    collaborators = collaborators.trim().split(/\s*,\s*/);

    for (const name of collaborators) {
      const user = await database.get(`
        SELECT id from users where name = ?
      `, [name]);

      if (!user) {
        continue;
      }

      runners.add(user.id);
    }
  }

  for (const userID of runners.values()) {
    await database.run(`
      INSERT INTO run VALUES (?, ?)
    `, [userID, id]);
  }

  let testers = JSON.parse(ctx.request.body.testers);
  if (testers.length > 0) {
    testers = testers.filter(t => t.name);
    const qmarks = new Array(testers.length)
      .fill('(?, ?, ?, ?, ?)')
      .join(', ');

    const subs = testers.map(t => [id, ...Object.values(t)])
      .flat(Infinity);

    await database.run(`
      INSERT INTO testersHave VALUES ${qmarks}
    `, subs);
  }

  ctx.redirect(`/artifacts/${artifactID}/experiments`);
});

router.post('/users', async ctx => {
  const { 
    name, 
    role,
    password
  } = ctx.request.body;

  const salt = await bcrypt.genSalt(1);
  const passwordHash = await bcrypt.hash(password, salt);

  await database.run(`
    INSERT INTO
      users(name, role, passwordHash)
    VALUES
      (?, ?, ?)
  `, [name, role, passwordHash]);

  ctx.redirect(`/users`);
  ctx.status = 301;
});

router.post('/users/:id/delete', async ctx => {
  const { id } = ctx.params;
  console.log({ id });

  if (!ctx.user.isAdmin) {
    return ctx.status = 403;
  }

  await database.run(`
    DELETE FROM users
    WHERE id = ?
  `, [id]);

  if (ctx.user.id === id) {
    await ctx.cookies.set('lapisLogin', null);
    return ctx.redirect('/login'); 
  }

  ctx.redirect(`/users/`);
  ctx.status = 301;
});

router.get('/users', async ctx => {
  const users = (await database.all(`
    SELECT id, name, role, id = ? as isSelf 
    FROM users
    ORDER BY name DESC
  `, [ctx.user.id])).map(user => ({
    ...user,
    canEdit: user.isSelf || ctx.user.isAdmin,
  }));

  await ctx.render('users', { 
    users, 
    title: 'Users',
    user: ctx.user,
    isAdmin: ctx.user.isAdmin,
  });
});

router.get('/users/:id/edit', async ctx => {
  const { id } = ctx.params;
  const user = await database.get(`
    SELECT * FROM users WHERE id = ?
  `, [id]);

  if (!user || !user.id) {
    return ctx.status = 404;
  }

  await ctx.render('usersEdit', {
    editing: user,
    user: ctx.user,
    title: user.id === ctx.user.id 
      ? 'Change Your Name' 
      : `Editing ${user.name}`,
    isAdmin: ctx.user.isAdmin,
  });
});

router.post('/users/:id', async ctx => {
  const { id } = ctx.params;
  const { name, role } = ctx.request.body;

  if (ctx.user.isAdmin && role) {
    await database.run(`UPDATE users SET name = ?, role = ? WHERE id = ?`, [name, role, id])
  } else {
    await database.run(`UPDATE users SET name = ? WHERE id = ?`, [name, id])
  }

  ctx.redirect('/users');
});

router.get('/stats', async ctx => {
  const { 
    artifactsCount,
    craftablesCount, 
    usersCount, 
    experimentsCount 
  } = await database.get(`
    SELECT 
      (SELECT COUNT(*) FROM artifacts) as artifactsCount,
      (SELECT COUNT(*) FROM craftable) as craftablesCount,
      (SELECT COUNT(*) FROM users) as usersCount,
      (SELECT COUNT(*) FROM experiments) as experimentsCount
  `);

  const ingredientsCount = (await database.all(`
    SELECT ingredients FROM craftable
  `)).map(i => i.ingredients.split(/\s*,\s*/))
     .flat(Infinity)
     .map(i => i.trim())
     .reduce((set, curr) => set.add(curr), new Set())
     .size;

  const { averageExperimentsPerArtifact } = await database.get(`
    SELECT AVG(experimentsCount) as averageExperimentsPerArtifact
    FROM (
      SELECT artifactID, COUNT(id) as experimentsCount
      FROM experiments
      GROUP BY artifactID
    )
  `);

  const { averageArtifactAuthorshipsPerUser } = await database.get(`
    SELECT AVG(artifactCount) as averageArtifactAuthorshipsPerUser
    FROM (
      SELECT userID, COUNT(artifactID) as artifactCount
      FROM authoredBy
      GROUP BY userID
    )
  `);

  const { numberOfArticlesWrittenByEveryone } = await database.get(`
      SELECT COUNT(*)
      AS numberOfArticlesWrittenByEveryone
      FROM artifacts a
      WHERE NOT EXISTS (
        SELECT u.id
        FROM users u
        WHERE NOT EXISTS (
          SELECT x.artifactID
          FROM authoredBy x
          WHERE x.artifactID = a.id
          AND x.userID = u.id
        )
      )
  `);

    await ctx.render('stats', {
      artifactsCount,
      craftablesCount,
      usersCount,
      ingredientsCount,
      experimentsCount,
      averageExperimentsPerArtifact,
      averageArtifactAuthorshipsPerUser,
      numberOfArticlesWrittenByEveryone,
      
      title: 'Stats',
      user: ctx.user,
    });
});

router.get('/ingredients', async ctx => {
  const ingredientsUnprocessed = (await database.all(`
    SELECT 
      craftable.ingredients, artifacts.id, artifacts.name
    FROM 
      craftable
    LEFT JOIN
      artifacts
    ON
      craftable.artifactID = artifacts.id
  `))
  .map(entry => {
    return { ...entry, 
      ingredients: entry.ingredients.split(/\s*,\s*/)
        .map(i => i.trim())
    }
  })
  .reduce((map, entry) => {
    const { id, name } = entry;

    for (let ingredient of entry.ingredients) {
      if (map.has(ingredient)) {
        const old = map.get(ingredient);
        map.set(ingredient, old.concat({ id, name }));
      } else {
        map.set(ingredient, [{ id, name }]);
      }
    }

    return map;
  }, new Map());

  const ingredients = [];
  for (let [name, artifacts] of ingredientsUnprocessed) {
    ingredients.push({ name, 
      artifacts: artifacts.map(a => (
        `<a href="/artifacts/${a.id}">${a.name}</a>`
      )).join(', '),
    });
  }

  await ctx.render('ingredients', {
    ingredients,
    title: 'All Ingredients',
    user: ctx.user,
  });
});

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(3000, async() => {
  console.log('Lapis is running! Navigate to localhost:3000 in your browser.');

  await migration(database);
});
