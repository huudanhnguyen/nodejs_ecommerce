const UsersModel 	= require(__path_models + 'users');
const notify  		= require(__path_configs + 'notify');
var md5 = require('md5');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use('local.signup',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    }, async function(req,email,password,done){
        try {
            let checkUser = await UsersModel.getItemByEmail(email)
            if(checkUser){
                return done(null,false,{message:"email đã tồn tại"});
            }
            let saveUser = await UsersModel.addOne(req.body)
                return done(null, saveUser)
          
    } catch (error) {
        console.log(error)
        return done(error);
    }
    }));
    passport.use('local.signin',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    }, async function(res,email,password,done){
        try {
            let checkUser = await UsersModel.getItemByEmail(email);
            // console.log(checkUser);
            return done(null,checkUser);
    } catch (error) {
        // console.log(error);
        return done(error);
    }
    }));
    passport.serializeUser(function(user, done) {
        done(null, user._id);     
    });
    
    passport.deserializeUser(function(id, done) {
        UsersModel.findById(id, null).then( (user,err) => {
            done(err, user);
        });
    });
}
