//express module 설치했으니 require('express')사용가능

var express = require('express');

var app = express();
var port = 3000;


app.get('/', function (req, res) {//get방식으로 보내기
    res.send('first app12');
});

app.listen(port, function () { //서버에 띄어주는
    console.log('Express listening on port', port);
});
