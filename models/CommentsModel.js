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
CommentsSchema.plugin(autoIncrement.plugin ,
    {model: "comments",field: "id",stratAt:1});

module.exports = mongoose.model("comments",CommentsSchema);