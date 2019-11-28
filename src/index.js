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

  console.log(ctx.request.body);

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
  console.log(token);
  ctx.redirect('/');
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

  await ctx.render('artifact', {
    artifact,
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
    dateModified
  } = ctx.request.body;

  await database.run(`
    INSERT INTO
      artifacts(name, description, usage, safetyLevel, dateModified)
    VALUES
      (?, ?, ?, ?, ?)
  `, [name, description, usage, safetyLevel, dateModified]);

  const { id } = await database
    .get(`select last_insert_rowid() as id`);

  ctx.redirect(`/artifacts/${id}`);
  ctx.status = 301;
});

router.get('/artifacts/:artifactID/crafting', async ctx => {
  const { artifactID } = ctx.params;
  const artifact = await database.get(`
    SELECT 
      artifacts.*,
      craftable.instructions
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

  const ingredients = await database.all(`
    SELECT
      ingredients.*
    FROM
      containing
    LEFT JOIN
      ingredients
    ON
      ingredients.id = containing.ingredientID
    WHERE
      containing.artifactID = ?
  `, [artifactID]);

  await ctx.render('crafting', {
    artifact,
    ingredients,
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
  
  let { collaborators } = ctx.request.body;
  if (collaborators) {
    collaborators = collaborators.trim().split(/\s*,\s*/);
    const runners = new Set([ctx.user.id]);

    for (const name of collaborators) {
      const user = await database.get(`
        SELECT id from users where name = ?
      `, [name]);

      if (!user) {
        continue;
      }

      runners.add(user.id);
    }

    for (const userID of runners.values()) {
      await database.run(`
        INSERT INTO run VALUES (?, ?)
      `, [userID, id]);
    }
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

  const passwordHash = await bcrypt.hash(password);

  await database.run(`
    INSERT INTO
      users(name, role, passwordHash)
    VALUES
      (?, ?, ?)
  `, [name, role, passwordHash]);

  const { id } = await database
    .get(`select last_insert_rowid() as id`);

  ctx.redirect(`/users/${id}`);
  ctx.status = 301;
});

router.post('/users/delete', async ctx => {
  const { id } = ctx.request.body;

  await database.run(`
    DELETE FROM users
    WHERE id = ?
  `, [id]);

  ctx.redirect(`/users/`);
  ctx.status = 301;
});

router.get('/users', async ctx => {
  const users = await database.all(`
    SELECT id, name, role 
    FROM users
  `);

  console.log(users);
  await ctx.render('users', { users, title: 'Users' });
});

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(3000, async() => {
  console.log('Lapis is running! Navigate to localhost:3000 in your browser.');

  await migration(database);
});