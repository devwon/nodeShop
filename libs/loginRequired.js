module.exports = function(req,res,next){
    if (!req.isAuthenticated()) {//isAuthenticated는 passport에서 제공
        res.redirect('/accounts/login');
    }else{
        return next();
    }
};