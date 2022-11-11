module.exports = (req, res, next) => {
    let userInfo = {};
    if(req.isAuthenticated()){
        userInfo = req.user;
    }
    res.locals.checkLogin = req.isAuthenticated();
    res.locals.userInfo = userInfo;
    next();
}