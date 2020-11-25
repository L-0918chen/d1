var Business = require("./Business.js");
var http = require("http");
var queryString = require("querystring");
var sql = require("mysql");
const { css } = require("jquery");
const { connect } = require("http2");
var db = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "dangdang"
});
db.connect(function(err){
    if(err){
        console.log("数据库连接失败");
    }else{
        console.log("数据库连接成功")
    }
});

// 数据库插入
function sql_insert(name,phone,password) {
    console.log(3)
    let sql = "INSERT INTO `user`(`name`, `phone`, `password`) VALUES (?,?,?)"
    db.query(sql, [name,phone,password], function (error, res) {
    })
}
// 数据查询
function sql_select(user,password) {
    let sql;
    sql = 'SELECT `password` FROM `user` WHERE phone=?';
    db.query(sql,[user], function (err, results) {
        select_value = results;
        if(!select_value.length){
            res.write(JSON.stringify({bool:false}));
            res.end();
        }else if(select_value[0].password !== password){
            res.write(JSON.stringify({bool:false}));
            res.end();
        }else{
            res.write(JSON.stringify({bool:true}));
            res.end();
        }
    })
}
var req,res,data,_type,select_value;
var server = http.createServer(creatHandler);
server.listen(4001,"192.168.43.155",function(){
    console.log("连接服务器")
});
function creatHandler(_req,_res){
    req = _req;
    res = _res;
    _type=null;
    req.on("data",dataHandler);
    req.on("end",endHandler)
}
function dataHandler(_data){
    data = String(_data)
}
function endHandler(){
    // 请求头    
    res.writeHead(200, {
        "content-type": "text/html;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    });

    var obj;
    if (req.method.toLowerCase() === "get") {
        if (req.url.indexOf("?") > -1) {
            obj = queryString.parse(req.url.split("?")[1]);
        }
    } else if (req.method.toLowerCase() === "post") {
        try {
            obj = JSON.parse(data);
        } catch (e) {
            obj = queryString.parse(data);
        }
    } else {
        res.end();
        return;
    }
    type();
    switch(_type){
        case "reg" :
            sql_insert(obj.name,obj.phone,obj.password);
            res.write(JSON.stringify({bool:true}));
            res.end();
            break;
        case "login" :
            sql_select(obj.user,obj.password)
            break;
        case "index":
            Business.getBookList(res);
            break;
        case "shoppingList" :
            Business.getShoppingList(res);
            break;
        case "addBooks" :
            Business.addBooks(res,obj);
            break;
        case "changeBooksNum" :
            Business.changeBooksNum(res,obj);
            break;
        case "deleteBooks":
            Business.deleteBooks(res,obj);
            break;
        case "selectBooks":
            Business.selectBooks(res,obj);
            break;
    }
}

// 获取接口
function type(){
    if(!req) return;
    if(_type) return _type;
    _type=(req.url.indexOf("?")>-1 ? req.url.split("?")[0] : req.url).slice(1);
}