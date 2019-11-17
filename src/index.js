// SOOOO much koa
import Koa from 'koa';
import Router from 'koa-router';
import convert from 'koa-convert';
import hbs from 'koa-hbs';
import serve from 'koa-static';
import mount from 'koa-mount';

const app = new Koa();
const router = new Router();

app.use(hbs.middleware({
  viewPath: __dirname + '/views',
  layoutsPath: __dirname + '/views/layouts',
  defaultLayout: 'application',
}));

router.get('/', convert(function*() {
  yield this.render('index', { title: 'koa-hbs' });
}));

app.use(mount('/static', serve('./static')))
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Lapis is running! Navigate to localhost:3000 in your browser.');
});