var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

//생성될 필드명을 정한다.
var ContactsSchema = new Schema({
    id: String, //id
    phoneNumber: Number, //연락처
    joined_at: Date //회원가입일
});

//db로 보내기
module.exports = mongoose.model('contacts',ContactsSchema);