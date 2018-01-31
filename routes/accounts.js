var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passwordHash = require('../libs/passwordHash');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//정책 선언
//serializeUser
passport.serializeUser(function(user,done){
    console.log('serializeUser');
    done(null,user);
});
//deserializeUser
passport.deserializeUser(function(user,done){
    var result = user;
    result.password="";
    console.log('deserializeUser');
    done(null,result);
});

passport.use(new LocalStrategy({
    usernaeeField: 'username',
    passwordField: 'password',
    passReqToCallback: true
    },
    //username,pw 일치,불일치 확인
    function(req,username,password,done){
        UserModel.findOne({username: username,password: passwordHash(password)},//pw 암호화
            function(err,user){
                if(!user){
                    return done(null,false,{message:"아이디 또는 비밀번호 오류 입니다."});
                }else{
                    return done(null,user);
                }
            }
        );
    }
));

router.get('/',function(req,res){
    res.send('account app');
});
router.get('/join',function(req,res){
    res.render('accounts/join');
});

//라우팅
//POST /join
router.post('/join',function(req,res){
    var User = new UserModel({
        username : req.body.username,
        password : passwordHash(req.body.password),
        displayname : req.body.displayname
    });
    User.save(function(err){
        res.send('<script>alert("회원가입 성공");\
        location.href="/accounts/login";</script>');
    });
});

router.get('/login',function(req,res){
    res.render('accounts/login', { flashMessage: req.flash().error });
});

router.post('/login',
    //미들웨어
    passport.authenticate('local',{
        failureRedirect: '/accounts/login/',
        failureFlash:true
    }),
    function(req,res){
        res.send('<script>alert("로그인 성공");\
        location.href="/";</script>'); 
    }
);

router.get('/success',function(req,res){
    res.send(req.user);
});

router.get('/logout',function(req,res){
    req.logout();//세션 해제
    res.redirect('/accounts/login');
});

module.exports =router;