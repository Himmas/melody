var views = require('co-views');
var koa = require('koa');
var app = koa();
var static_dir = require('koa-static');
var path = require('path');

app.use(static_dir(path.join(__dirname,'/src')));//静态目录配置


// app.use(function *(){
//     this.body = yield render('index', { app: himmas });
// });

app.listen(4002);
