var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

//생성될 필드명을 정한다.
var ProductsSchema = new Schema({
    name: String, //제품명
    price: Number, //가격
    description: String, //설명
    created_at: { //작성일
        type: Date,
        default: Date.now()
    }
});

// 1씩 증가하는 primary Key를 만든다
// model : 생성할 document 이름
// field : primary key , startAt : 1부터 시작 시작점을 정해준다.
ProductsSchema.plugin(autoIncrement.plugin, { model: 'products', field: 'id', startAt: 1 });
module.exports = mongoose.model('products', ProductsSchema);