//数据执行

const db = require('./connect');

//创建表
    let sql = "CREATE TABLE wxdata (id int AUTO_INCREMENT,wx_id VARCHAR(255),wx_name VARCHAR(255),wx_img VARCHAR(255),wx_status int DEFAULT 0 COMMENT '状态',PRIMARY KEY(ID))";
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log('创建表成功');
        }
})
