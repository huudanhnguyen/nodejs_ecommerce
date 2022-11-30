const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig       = require(__path_configs + 'system');

const linkLogin		     = StringHelpers.formatLink('/user/signin/');
const linkNoPermission	 = StringHelpers.formatLink('../vviews/ecommerce/pages/error/index.ejs');


module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
}else {
    res.redirect(linkLogin)
}
    
}