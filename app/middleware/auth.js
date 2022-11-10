const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig       = require(__path_configs + 'system');

const linkLogin		     = StringHelpers.formatLink('/' + systemConfig.prefixBlog + '/auth/login/');
const linkNoPermission	 = StringHelpers.formatLink('/' + systemConfig.prefixBlog + '/auth/no-permission');

module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }else {
        next()
    }
    
}