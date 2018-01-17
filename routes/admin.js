var express = require('express');//module 가져오기

var router = express.Router();

router.get('/',function(req,res){
    res.send("admin app router");
});

module.exports = router;
