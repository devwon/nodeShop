var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    if (!req.isAuthenticated()) {
        res.send('<script>alert("로그인이 필요한 서비스입니다.");location.href="/accounts/login";</script>');
    } else {
        res.render('chat/index');
    }
});

module.exports=router;