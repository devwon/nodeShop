var express = require('express');//module 가져오기
var admin = require('./admin');//위에 위치해야해!
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');
//var loginRequired = require('../libs/loginRequired');
//관리자 권한
var adminRequired = require('../libs/adminRequired');
var co = require('co');
var paginate = require('express-paginate');
var CheckoutModel = require('../models/CheckoutModel');

//미들웨어 연습
function testMiddleWare(req, res, next) {
    console.log('미들웨어 작동');
    next();
}


//csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie : true});

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join(__dirname, '../uploads'); // 루트의 uploads위치에 저장한다.
var fs = require('fs');

//multer 셋팅
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) { // products-날짜.jpg(png) 저장 
        callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
var upload = multer({ storage: storage });

//admin 화면
router.get('/',function(req,res){
    res.send("admin app router");
});

//admin/이후의 url을 적는다
//res.send("admin products");
//products list 페이지
router.get('/products', adminRequired, paginate.middleware(5, 50), async (req, res) => {//한 페이지에 보이는 개수

    const [results, itemCount] = await Promise.all([
        ProductsModel.find().limit(req.query.limit).skip(req.skip).exec(),
        ProductsModel.count({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);

    const pages = paginate.getArrayPages(req)(4, pageCount, req.query.page);//슬라이더 개수

    res.render('admin/products', {
        products: results,
        pages: pages,
        pageCount: pageCount,
    });

});
    /*
    ProductsModel.find(function(err, products){//인자는 에러와 products
        res.render('admin/products',//views의 위치
            { products : products}//두번째 products가 위의 인자
            //DB에서 받은 products를 products변수명으로 내보냄
        );
    });
    */

//작성 폼-get으로 라우팅//csrf걸기
router.get('/products/write',adminRequired, csrfProtection, function (req, res) {
    res.render('admin/form', { product: "" ,csrfToken: req.csrfToken() });//product변수는 빈걸로 선언해주고 시작, token발행해줌
});
    
router.post('/products/write',adminRequired, upload.single('thumbnail'),csrfProtection, function (req, res) {//csrfProtection 토큰을 확인하고 DB에 저장
    console.log(req.file);

    var product = new ProductsModel({
        name: req.body.name,
        thumbnail: (req.file) ? req.file.filename : "",//thumbnail 필드명을 DB에 저장/(조건)?결과:아니면
        price: req.body.price,
        description: req.body.description,
        username : req.user.username,
    });
    //유효성체크(validation check) 후 DB로 넘길지 말지 결정
    if (!product.validateSync()) {
        product.save(function (err) {
            res.redirect('/admin/products');
        });
    }
});

//제품 상세 페이지//콜백 3개
router.get('/products/detail/:id', function(req, res){
    
    var getData = async ()=>{
        var product = await ProductsModel.findOne({ 'id': req.params.id }).sort().exec();
        console.log(product.id);//콜백 대신
        var comments = await CommentsModel.find({ 'product_id': req.params.id }).exec();
        return {
            product: product,
            comments: comments
        };
    };
    getData().then(function (result) {
        res.render('admin/productsDetail', { product: result.product, comments: result.comments });
    });
});

//제품 수정 페이지
router.get('/products/edit/:id', adminRequired, csrfProtection,function(req,res){
    //기존에 폼에 value안에 값을 셋팅하기 위해서 만든다.
    ProductsModel.findOne({'id': req.params.id},function(err, product){//
        res.render('admin/form', { product: product, csrfToken: req.csrfToken()});//token 발행
    });
});

//수정 완료 후 저장
router.post('/products/edit/:id', adminRequired, upload.single('thumbnail'), csrfProtection, function (req, res) {
        
    //*그전에 지정되있는 파일명id을 받아온다.
    ProductsModel.findOne({ id: req.params.id }, function (err, product) {
        
        if(req.file && product.thumbnail){//기존에 파일이 있었던 경우에만 파일 삭제 가능
            fs.unlinkSync(uploadDir+'/'+product.thumbnail);
        }
        
        //넣을 변수 값을 셋팅한다
        var query = {
            name: req.body.name,
            thumbnail: (req.file)? req.file.filename: product.thumbnail,
            price: req.body.price,
            description: req.body.description,
        };

        //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
        ProductsModel.update({ id: req.params.id }, { $set: query }, function (err) {
            res.redirect('/admin/products/detail/' + req.params.id); //수정후 본래보던 상세페이지로 이동
        });
    });   
});

//제품 삭제 페이지
router.get('/products/delete/:id', adminRequired,function(req,res){
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

//summernote editor
router.post('/products/ajax_summernote',adminRequired,upload.single('thumnail'),function(req,res){
    res.send('/uploads/'+req.file.filename);
});

//order list
router.get('/order', function (req, res) {
    CheckoutModel.find(function (err, orderList) { //첫번째 인자는 err, 두번째는 받을 변수명
        res.render('admin/orderList',
            { orderList: orderList }
        );
    });
});
//order edit
router.get('/order/edit/:id', function (req, res) {
    CheckoutModel.findOne({ id: req.params.id }, function (err, order) {
        res.render('admin/orderForm',
            { order: order }
        );
    });
});

module.exports = router;
