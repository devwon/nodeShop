var express = require('express');
var contacts = require('./contacts');
var router = express.Router();
var ContactsModel = require('../models/ContactsModel');

router.get('/',function(req,res){
    res.send("contacts app router");
});

//contacts/이후의 url을 적는다.
router.get('/list',function(req,res){
    ContactsModel.find(function(err,contacts){
        res.render('contacts/list',
            {contacts : contacts}
        );
    });
});

//작성 페이지
router.get('/write',function(req,res){
    res.render('contacts/form',{contacts:""});
});

router.post('/write',function(req,res){
    var contacts = new ContactsModel({
        id : req.body.id,
        phoneNumber : req.body.phoneNumber,
        joined_at : req.body.joined_at
    });
    contacts.save(function(err){
        res.redirect('/contacts');
    });
});

//상세 페이지
router.get('/detail/:id',function(req,res){
    ContactsModel.findOne({'id':req.params.id},function(err,contacts){
        res.render('contacts/contactsDetail',{contacts: contacts});
    });
});

module.exports = router;