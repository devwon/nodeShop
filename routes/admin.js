var express = require('express');//module 가져오기
var admin = require('./admin');//위에 위치해야해!
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');

router.get('/',function(req,res){
    res.send("admin app router");
});

//admin/이후의 url을 적는다
//res.send("admin products");
router.get('/products', function (req, res) {
    res.render('admin/products',{
        message : "hello",
        name : "HYERIN"
    } // message 란 변수를 템플릿으로 내보낸다.
    );
});
//작성 폼-get으로 라우팅
router.get('/products/write', function (req, res) {
    res.render('admin/form');
});
    
router.post('/products/write', function (req, res) {
    var product = new ProductsModel({//mongoose에서 insert하는 방식:key field 일치 시켜주기
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
    });
    product.save(function (err) {//DB에 저장, 
        res.redirect('/admin/products');//새로고침시 다시 저장될 수 있으니 save button 클릭시 list페이지로 이동
    });
});

module.exports = router;
