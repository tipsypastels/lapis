// SOOOO much koa
import Koa from 'koa';
import Router from 'koa-router';
import hbs from 'koa-hbs-renderer';
import serve from 'koa-static';
import mount from 'koa-mount';
import body from 'koa-body';
import sqlite3 from 'sqlite3-promisify';
import migration from './migration';

const app = new Koa();
const router = new Router();
const database = new sqlite3('./database.sqlite');

migration(database);

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

/**
 * This is an example of a GET page - which means any page that the user can directly navigate to in a browser. GET pages usually involve querying the database, and then rendering a particular template - in this case "index" which corresponds to the index.hbs file in the views folder.
 * 
 * ctx.render is a function that takes the name of a template, and the data that should be passed to that template. In this case we are passing the list of artifacts that we queried, and a title string.
 */
router.get('/', async ctx => {
  const artifacts = await database.all(`
    SELECT * FROM artifacts
  `);

  console.log(artifacts);
  await ctx.render('index', { artifacts, title: 'Lapis' });
});

/**
 * This is an example of a POST route. POST routes are not something you directly navigate to in your browser - think of them as places that handle the results of various user input that gets sent to the server. For example, this route handles creating a new artifact based on the data the user submitted.
 * 
 * Because POST routes are not pages, they don't need to display data. Instead, they usually create or modify existing data, then redirect the user to a page. In this case we create an artifact, and then redirect the user to that artifact's page.
 * 
 * The data submitted by the user can be found on the ctx.request.body object. We use object destructuring at the beginning of this function to extract them into unique variables.
 */
router.post('/artifacts', async ctx => {
  // extract the data submitted by the user
  const { 
    name, 
    description, 
    usage, 
    safetyLevel,
    dateModified
  } = ctx.request.body;

  // save it into the database
  await database.run(`
    INSERT INTO
      artifacts(name, description, usage, safetyLevel, dateModified)
    VALUES
      (?, ?, ?, ?, ?)
  `, [name, description, usage, safetyLevel, dateModified]);

  // the id is autogenerated so we need to grab it
  const { id } = await database
    .get(`select last_insert_rowid() as id`);

  // redirect to the new page of that artifact 
  ctx.redirect(`/artifacts/${id}`);

  // 301 tells the browser that the artifact was created successfully
  ctx.status = 301;
});

/**
 * ADMIN - Query 1
 * Add new user
 */
router.post('/users', async ctx => {
  // extract the data submitted by the user
  const { 
    name, 
    role,
    passwordHash
  } = ctx.request.body;

  // save it into the database
  await database.run(`
    INSERT INTO
      users(name, role, passwordHash)
    VALUES
      (?, ?, ?)
  `, [name, role, passwordHash]);

  // the id is autogenerated so we need to grab it
  const { id } = await database
    .get(`select last_insert_rowid() as id`);

  // redirect to the new page of that users
  ctx.redirect(`/users/${id}`);

  // 301 tells the browser that the users was created successfully
  ctx.status = 301;
});

/**
 * ADMIN - Query 2
 * Delete User
 */
router.post('/users', async ctx => {
  // extract the data submitted by the user
  const { 
    id
  } = ctx.request.body;

  // delete user
  await database.run(`
    DELETE FROM users
    WHERE id = ?
  `, [id]);

  // redirect to the new page of that user
  ctx.redirect(`/users/`);

  // 301 tells the browser that the users was created successfully
  ctx.status = 301;
});

/**
 * ADMIN - Query 3
 * View all the users
 */
router.get('/', async ctx => {
  const artifacts = await database.all(`
    SELECT id, name, role 
    FROM users
  `);

  console.log(users);
  await ctx.render('index', { users, title: 'Users' });
});

app.use(mount('/static', serve('./static')))
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Lapis is running! Navigate to localhost:3000 in your browser.');
});