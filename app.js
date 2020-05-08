const express = require('express');

const app = express();

const path = require('path');

const session = require('express-session');

//设置post请求参数
const bodyParser = require('body-parser');

//引入MySQL数据库
require('./model/connect');

//设置模板前缀和后缀和使用的模块
app.set('views',path.join(__dirname,'views'))
app.set('view engine','art');
app.engine('art',require('express-art-template'))


app.use(session({secret:'secret key'}));

//访问所有静态文件
app.use(express.static(path.join(__dirname,'public')))

//接受post请求
app.use(bodyParser.urlencoded({extended: false}));


//判断是否登录过
app.use('/admin',(req,res,next)=>{
    console.log(req.url);
    console.log(app.locals.str);
    if(req.url == '/gz' || req.url == '/value'){
        next();
        return;
    }
    if(req.url != '/login' && !app.locals.str){
        res.redirect('/admin/login');
    }else{
        next();
    }
})

//设置路由
const admin = require('./route/admin')
app.use('/admin',admin)

app.listen(3000);
console.log('服务器启动成功')