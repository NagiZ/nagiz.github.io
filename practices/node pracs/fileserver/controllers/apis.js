const md = require('../methods.js');

module.exports = {
    'GET /': async (ctx, next)=>{
        ctx.render('upload.html');
    }
    // 'POST /data/upload': async (ctx, next)=>{
    //     ctx.response.body = '{saf:dsf}';
    // }
}