const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig       = require(__path_configs + 'system');

const linkLogin		     = StringHelpers.formatLink('/user/signin/');
const linkNoPermission	 = StringHelpers.formatLink('/auth/no-permission');

module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        console.log(req.user)
        if(req.user.email == "huudanh2001.hd@gmail.com") {
            next();
        }else {
            res.redirect(linkNoPermission);
        }
    }else {
        res.redirect(linkLogin);
    }
    
}