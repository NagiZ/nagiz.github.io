const rest = require('./rest.js');
const koa = require('koa');
const bd = require('koa-bodyparser');
const ctrl = require('./controller.js');
const router = require('koa-router')();
const template = require('./template.js');
const multer = require('koa-multer');
const app = new koa();
var upload = multer({dest: 'uploads/'});

router.post('/data/upload', upload.single('file'),async (ctx, next)=>{
    console.log(ctx.req.file.size);
    console.log(ctx.req.file.originalname);
    console.log(ctx.req.file.path);
    console.log(ctx.req.file.destination);
    ctx.response.type = 'text/html';
    ctx.response.body = '<p>' + ctx.req.file.size + 'kB' + '</p>';
    await next();
    // ctx.response.type = 'application/json';
    // ctx.response.body = 
});

app.use(bd());
app.use(template('views', {
    noCache: true,
    watch: true
}));
app.use(router.routes());
app.use(ctrl());
app.listen(3030, '0.0.0.0');