var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user,done){
    done(null, user);
});
passport.deserializeUser(function(user,done){
    done(null, user);//수정가능한 내용은 deserialize로 세션 업데이트
});

//facebook
passport.use(new FacebookStrategy({
    // https://developers.facebook.com에서 appId 및 scretID 발급
    clientID: "409665479471096", //앱 ID
    clientSecret: "178b7928dea72495d5f0fd30fbbee810", //입력하세요.
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
},
    function (accessToken, refreshToken, profile_fb, done) {
        //아래 하나씩 찍어보면서 데이터를 참고해주세요.
        //console.log(profile);
        //console.log(profile.displayName);
        //console.log(profile.emails[0].value);
        //console.log(profile._raw);
        //console.log(profile._json);
    
        UserModel.findOne({ username: "fb_" + profile_fb.id }, function (err, user) {
            if (!user) {  //없으면 회원가입 후 로그인 성공페이지 이동
                var regData = { //DB에 등록 및 세션에 등록될 데이터
                    username: "fb_" + profile_fb.id,
                    password: "facebook_login",
                    displayname: profile_fb.displayName
                };
                var User = new UserModel(regData);
                User.save(function (err) { //DB저장
                    done(null, regData); //세션 등록
                });
            } else { //있으면 DB에서 가져와서 세션등록
                done(null, user);
            }

        });
    }
));
//github
passport.use(new GitHubStrategy({
    clientID: "9d5b4693266a26637d5b",
    clientSecret: "f1b2b8abacaf8a98591494fe256189ae4bbb490b",
    callbackURL: "http://127.0.0.1:3000/auth/github/callback",
    profileFields: ['id', 'name', 'photos', 'email'] //받고 싶은 필드 나열
},
    function (accessToken, refreshToken, profile_git, done) {
        //console.log(user);//id test
        //console.log(profile.displayName);
        UserModel.findOne({ username: "git_"+profile_git.id},function(err,user){
            if(!user){
                var regData={
                    username:"git_"+Stirng(profile_git.id),
                    password: "github_login",
                    //displayname: String(profile_git.username)//변수이름을 displayname으로 바꿔야하는데 그러면 socket error 뜬다
                };
                var User = new UserModel(regData);
                User.save(function (err){//DB저장
                done(null,regData);//세션 등록
                });
            } else{//있으면 DB에서 가져와서 세션등록
                done(null, user);
            }
        });
    }
));

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook',passport.authenticate('facebook',{scope:'email'}));
// http://localhost:3000/auth/github 접근시 github로 넘길 url 작성해줌
router.get('/github',passport.authenticate('github'));

//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    passport.authenticate('facebook',
        {// 분기만 해줌
            successRedirect: '/',
            failureRedirect: '/auth/facebook/fail'
        }
    )
);
//인증후 깃허브에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/github/callback',
    passport.authenticate('github',
        {   successRedirect:'/',
            //failureRedirect: '/login' 
            failureRedirect: '/auth/facebook/fail'
        }
    )
);

//페이스북 로그인 성공시 이동할 주소
router.get('/facebook/success',function(req,res){
    res.send(req.user);
})

router.get('/facebook/fail', function (req, res) {
    res.send('facebook login fail');
});
//깃허브 로그인 성공시 이동할 주소
router.get('/github/success', function (req, res) {
    res.send(req.user);
})

router.get('/github/fail', function (req, res) {
    res.send('github login fail');
});


module.exports = router;