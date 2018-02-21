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

//라우터 작성
var admin = require('./routes/admin');
var accounts =require('./routes/accounts');
//contacts
var contacts = require('./routes/contacts');
//auth
var auth = require('./routes/auth');
//chat
var chat = require('./routes/chat');
//products
var products = require('./routes/products');
//cart
var cart = require('./routes/cart');
//checkout
var checkout = require('./routes/checkout');

//home
var home = require('./routes/home');

var app = express();
var port = 3000;

// 확장자가 ejs로 끝나는 뷰view 엔진을 추가한다.
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

//static path 추가
app.use('/static', express.static('static'));

//session 관련 셋팅
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session);

var sessionMiddleWare = session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new MongoStore({//storage로 저장하면 서버 부담 줄어듬
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60
    })
});
app.use(sessionMiddleWare);

//passport 적용
app.use(passport.initialize());
app.use(passport.session());

//플래시 메시지 관련
app.use(flash());

//로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다
app.use(function(req,res,next){
    app.locals.isLogin = req.isAuthenticated();
    //app.locals.lecture = "nodejs";//app.locals는 view에서 언제든지 사용가능하게
    //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
    app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
    next();
});


//라우팅 routing
app.use('/admin', admin);
app.use('/contacts', contacts);
app.use('/accounts', accounts);
app.use('/auth', auth);
app.use('/chat', chat);
app.use('/products', products);
app.use('/cart', cart);
app.use('/checkout', checkout);
app.use('/', home);


var server = app.listen(port, function () { //서버에 띄어주는
    console.log('Express listening on port', port);
});

var listen = require('socket.io');
var io = listen(server);//server 붙여버리기
//socket io passport 접근하기 위한 미들웨어 적용
io.use(function(socket,next){//io.use
    sessionMiddleWare(socket.request, socket.request.res, next);
});

require('./libs/socketConnection')(io);//불러오고 바로 실행