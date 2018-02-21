//import { format } from 'util';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var CheckoutSchema = new Schema({

    imp_uid: String, //고유ID
    merchant_uid: String, //상점 거래ID
    paid_amount: Number, //결제금액
    apply_num: String, //카드 승인번호

    buyer_email: String, //이메일
    buyer_name: String, //구매자 성함
    buyer_tel: String, //전화번호
    buyer_addr: String, //구매자 주소

    buyer_postcode: String, //우편번호

    status: String, //결재완료, 배송중 등등
    song_jang: String, //송장번호

    created_at: {
        type: Date,
        default: Date.now()
    }
});
//virtual변수
CheckoutSchema.virtual('getDate').get(function () {
    var date = new Date(this.created_at);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    };
});
//numberformat
CheckoutSchema.virtual('getAmountFormat').get(function () {
    // 1000원을 1,000원으로 바꿔준다.
    return new Intl.NumberFormat().format(this.paid_amount);
});

CheckoutSchema.plugin(autoIncrement.plugin, { model: "checkout", field: "id", startAt: 1 });
module.exports = mongoose.model("checkout", CheckoutSchema);