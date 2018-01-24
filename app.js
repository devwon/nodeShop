//express module 설치했으니 require('express')사용가능
var express = require('express');
var path = require('path'); //미들웨어의 윗부분에 적혀있어야함!
var logger = require('morgan');
var bodyParser = require('body-parser');//javascript 객체로 편하게 사용하기 위해 bodyparser 이용

//MongoDB 접속 express아래에 위치해야함!
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;//nodejs내의 promise로 바꿔라
var autoIncrement = require('mongoose-auto-increment');//key value 생성을 위한 모듈

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log('mongodb connect');//접속 성공됬는지 확인하기 위해
});

var connect = mongoose.connect('mongodb://127.0.0.1:27017/fastcampus', { useMongoClient: true });
autoIncrement.initialize(connect);


var admin = require('./routes/admin');
//contacts
var contacts = require('./routes/contacts');

var app = express();
var port = 3000;

// 확장자가 ejs 로 끝나는 뷰view 엔진을 추가한다.
app.set('views', path.join(__dirname, 'views'));//console.log(__dirname);//_dirname은 내 ROUTE를 알려줌
app.set('view engine', 'ejs');


//미들웨어는 항상 라우팅 오기 전에
//미들웨어 셋팅(request객체에 변수를 추가), POST는 body의 데이터를 가져옴
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', function (req, res) {//get방식으로 보내기
    res.send('first app!!');
});

app.use('/admin', admin);
app.use('/contacts', contacts);

app.listen(port, function () { //서버에 띄어주는
    console.log('Express listening on port', port);
});
