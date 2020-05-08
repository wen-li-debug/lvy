const express = require('express');

const admin = express.Router();

const path = require('path');

//引入数据
const db = require('../model/connect');

//用来接收文件类型
const formidable = require('formidable');

//登录页面
admin.get('/login',(req,res)=>{
    res.render('admin/login')
})


//登录页面判断
admin.post('/login',(req,res)=>{
    let str = 'wl2020';
    req.app.locals.str= str;
    let { pwd } = req.body;
    if(str == pwd ){
        res.redirect('index');
    }else{
        res.render('admin/login',{msg:'密码错误'});
    }
})

//存储数据的参数
let arr= [];
let id = 0;

//添加页面
admin.post('/add',(req,res)=>{
    
    //创建解析对象
    let form = new formidable.IncomingForm();
    //配置上传文件的位置
    form.uploadDir = path.join(__dirname,'../','public','upload');
    //是否保存文件后缀
    form.keepExtensions = true;
    //解析文件，获取input和file 中的数据
    form.parse(req, function(err, fields, files) {  
            //获取图片的路径
            fields.wx_img = files.wx_img.path.split('public')[1];
            console.log(fields);
            let sql = 'INSERT INTO wxdata SET ?';
            db.query(sql,fields,(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    //跳转到管理页面
                    res.redirect('index');
                }
            })
            
    });  
   
})
//管理页面
admin.get('/index',(req,res)=>{
    let arrs = [{num:'请添加微信号'}];
    //查询所有数据
    let sql = 'select * from sum,wxdata where sum.n_id = wxdata.n_id';
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result.length == 0){
                console.log(arrs[0].num)
                res.render('admin/index', {arr:arrs} )
                return;
            }
            console.log(result)
            res.render('admin/index', {arr:result} )
        }
    })
    
})

//删除数据
admin.get('/del',(req,res)=>{
    // let {id} = req.query;
    let sql = `DELETE FROM wxdata WHERE id=${req.query.id}`;
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('index');
        }
    })
})

//修改数据
admin.get('/updata',(req,res)=>{
     let {id,status} = req.query;
        status = status == 0 ? 1:0;
    let sql = `UPDATE wxdata SET wx_status = ${status} WHERE id = ${id}`;
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('index');
        }
   })
   
})

//查看数据
admin.get('/check',(req,res)=>{
     //查询所有数据
     let sql = 'SELECT * FROM wxdata';
     db.query(sql,(err,result)=>{
         if(err){
             console.log(err);
         }else{
             res.send(result);
         }
     })
})


//客户页面
admin.get('/gz',(req,res)=>{
     //查询所有数据
     let sql = 'SELECT * FROM wxdata WHERE wx_status = 0';
     db.query(sql,(err,result)=>{
         if(err){
             console.log(err);
         }else{
             if(result.length == 0){
                res.render('admin/gz',{arr:{wx_id:123456}});
             }else{
                var a = Math.floor((Math.random() * result.length));
                res.render('admin/gz',{arr:result[a]});
             } 
         }
     })
})

//记录转化数

admin.get('/value',(req,res)=>{
    let sql = 'UPDATE sum SET num = num + 1 ';
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.render('admin/wx');
        }
    })
})



module.exports = admin;