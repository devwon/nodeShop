var express = require('express');//module 가져오기
var admin = require('./admin');//위에 위치해야해!
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');

router.get('/',function(req,res){
    res.send("admin app router");
});

//admin/이후의 url을 적는다
//res.send("admin products");
//products list 페이지
router.get('/products', function (req, res) {
    ProductsModel.find(function(err, products){//인자는 에러와 products
        res.render('admin/products',//views의 위치
            { products : products}//두번째 products가 위의 인자
            //DB에서 받은 products를 products변수명으로 내보냄
        );
    });
});
//작성 폼-get으로 라우팅
router.get('/products/write', function (req, res) {
    res.render('admin/form',{product: ""});//product변수는 빈걸로 선언해주고 시작
});
    
router.post('/products/write', function (req, res) {
    var product = new ProductsModel({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
    });
    //유효성체크 후 DB로 넘길지 말지 결정
    if (!product.validateSync()) {
        product.save(function (err) {
            res.redirect('/admin/products');
        });
    }
});

//제품 상세 페이지//콜백 3개
router.get('/products/detail/:id', function(req, res){
    //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
    ProductsModel.findOne({'id': req.params.id},function(err, product){//findOne(조건,콜백함수)는 한 줄의 데이터만 가져와
        //res.render('admin/productsDetail', {product:product});
        CommentsModel.find({ product_id: req.params.id }, function (err, comments) {
            res.render('admin/productsDetail',
                {product : product, comments : comments });
        });
    });
});

//제품 수정 페이지
router.get('/products/edit/:id',function(req,res){
    //기존에 폼에 value안에 값을 셋팅하기 위해서 만든다.
    ProductsModel.findOne({'id': req.params.id},function(err, product){//
        res.render('admin/form',{product:product});
    });
});

//수정 완료 후 저장
router.post('/products/edit/:id', function (req, res) {
    //넣을 변수 값을 셋팅한다
    var query = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
    };

    //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
    ProductsModel.update({ id: req.params.id }, { $set: query }, function (err) {
        res.redirect('/admin/products/detail/' + req.params.id); //수정후 본래보던 상세페이지로 이동
    });
});

//제품 삭제 페이지
router.get('/products/delete/:id',function(req,res){
    ProductsModel.remove({ id: req.params.id }, function (err) {//params<-parameter
        res.redirect('/admin/products');//절대 경로로 써줘
    });
});//require로 따로 뺄 수 있어

//댓글 기능
router.post('/products/ajax_comment/insert',function(req,res){
    var comment = new CommentsModel({
        content: req.body.content,
        product_id: parseInt(req.body.product_id)
    });
    comment.save(function(err,comment){
        res.json({
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    });
});

//댓글 삭제 기능
router.post('/products/ajax_comment/delete', function (req, res) {
    CommentsModel.remove({ id: req.body.comment_id }, function (err) {
        res.json({ message: "success" });
    });
});

module.exports = router;
