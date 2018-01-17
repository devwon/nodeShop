var express = require('express');//module 가져오기

var admin = require('./routes/admin');//위에 위치해야해!

var router = express.Router();

router.get('/',function(req,res){
    res.send("admin app router");
});

//admin/이후의 url을 적는다
router.get('/products',function(req,res){
    res.send("admin products");
});
module.exports = router;
