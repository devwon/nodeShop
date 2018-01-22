//express module 설치했으니 require('express')사용가능
var express = require('express');

//MongoDB 접속 express아래에 위치해야함!
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');//key value 생성을 위한 모듈

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log('mongodb connect');//접속 성공됬는지 확인하기 위해
});

var connect = mongoose.connect('mongodb://127.0.0.1:27017/fastcampus', { useMongoClient: true });
autoIncrement.initialize(connect);


var admin = require('./routes/admin');

var app = express();
var port = 3000;


app.get('/', function (req, res) {//get방식으로 보내기
    res.send('first app!!');
});

app.use('/admin', admin);

app.listen(port, function () { //서버에 띄어주는
    console.log('Express listening on port', port);
});
