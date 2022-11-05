const UsersModel 	= require(__path_models + 'users');
const notify  		= require(__path_configs + 'notify');
var md5 = require('md5');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use(new LocalStrategy(
        function(username, password, done) {
            UsersModel.getItemByUsername(username, null).then( ( users) => {
                let user = users[0];
                if (user === undefined || user.length == 0) {
                    return done(null, false, { message: notify.ERROR_LOGIN });
                }else {
                    if(md5(password) !== user.password) {
                        return done(null, false, { message: notify.ERROR_LOGIN });
                    }else {
                        return done(null, user);
                    }
                }
            });
        }
    ));
    passport.use('local.signup',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },function(res,email,password,done){
        UsersModel.findOne({'email':email},function(err,user){
            if(err){
                return done(err);
            }
            if(user){
                return done(null,false,{message:"email đã tồn tại"});
            }
            var newUser=new UsersModel();
            newUser.email=email;
            newUser.password=newUser.encryptPassword(password);
            newUser.save(function(err,result){
                if(err){
                    return done(err);
                }
                return done(null,newUser);
            });
        });

    }));
    passport.serializeUser(function(user, done) {
        done(null, user._id);     
    });
    
    passport.deserializeUser(function(id, done) {
        UsersModel.findById(id, null).then( (err,user) => {
            done(err, user);
        });
    });
}
