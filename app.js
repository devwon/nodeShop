//express module 설치했으니 require('express')사용가능
var express = require('express');
var path = require('path'); //미들웨어의 윗부분에 적혀있어야함!
var logger = require('morgan');
var bodyParser = require('body-parser');//javascript 객체로 편하게 사용하기 위해 bodyparser 이용
//cookie 사용 가능하게 설정
var cookieParser = require('cookie-parser');

//flash  메시지 관련
var flash = require('connect-flash');

//passport 로그인 관련
var passport = require('passport');
var session = require('express-session');


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
var accounts =require('./routes/accounts');
//contacts
var contacts = require('./routes/contacts');

var app = express();
var port = 3000;

// 확장자가 ejs 로 끝나는 뷰view 엔진을 추가한다.
app.set('views', path.join(__dirname, 'views'));//console.log(__dirname);//_dirname은 내 ROUTE를 알려줌
app.set('view engine', 'ejs');

//미들웨어 셋팅
//(=request 객체에 변수를 추가/request.file 이런 식으로), POST는 body의 데이터를 가져옴
//미들웨어는 항상! 라우팅 오기 전!!!!에
//모든 라우팅이 오기전에 요청을 먼저 가로채는 미들웨어
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());//cookie parser 사용

//업로드 path 추가
app.use('/uploads',express.static('uploads'));

//session 관련 셋팅
app.use(session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
}));

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());




//라우팅
app.get('/', function (req, res) {//get방식으로 보내기
    res.send('first app!!');
});

app.use('/admin', admin);
app.use('/contacts', contacts);
app.use('/accounts', accounts);

app.listen(port, function () { //서버에 띄어주는
    console.log('Express listening on port', port);
});
