var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var UserSchema = new Schema({
    username: {
        type: String,
        required: [true, '아이디는 필수입니다.']
    },
    password: {
        type: String,
        required: [true, '패스워드는 필수입니다.']
    },
    displayname: String,
    created_at: {//회원가입일
        type: Date,
        default: Date.now()
    }
});

UserSchema.plugin(autoIncrement.plugin, { model: "user", field: "id", startAt: 1 });
module.exports = mongoose.model('user', UserSchema);