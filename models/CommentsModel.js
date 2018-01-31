var mongoose = new require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var CommentsSchema = new Schema({
    content: String,
    created_at: {
        type: Date,
        default: Date.now()
    },
    product_id: Number
});

// 1씩 증가하는 primary Key를 만든다
// model : 생성할 document 이름
// field : primary key , startAt : 1부터 시작 시작점을 정해준다.
CommentsSchema.plugin(autoIncrement.plugin ,
    {model: "comments",field: "id",stratAt:1});

module.exports = mongoose.model("comments",CommentsSchema);