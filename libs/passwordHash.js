var crypto = require('crypto');
var mysalt = "whr";//임의로 정해주는 값

module.exports = function(password){
    return crypto.createHash('sha512').update(password + mysalt).digest('base64');
};