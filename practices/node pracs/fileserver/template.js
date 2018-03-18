const nunjucks = require('nunjucks');

function creEnv(path, opts){
    let autoescape = opts.autoescape===undefined? true : opts.autoescape,
        noCache = opts.noCache||false,
        watch = opts.watch||false,
        thorwOnUndefined = opts.thorwOnUndefined||false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch
            }), {
                autoescape: autoescape,
                thorwOnUndefined: thorwOnUndefined
            });
    if(opts.filters){
        for(var f in opts.filters){
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

function template(path, opts){
    var env = creEnv(path, opts);
    return async(ctx, next)=>{
        ctx.render = function(view, model){
            ctx.response.type = 'text/html';
            ctx.response.body = env.render(view, Object.assign({}, ctx.state||{}, model));
        }
        await next();
    }
}

module.exports = template;