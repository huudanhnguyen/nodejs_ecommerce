var express = require('express');
var router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const notify = require(__path_configs + 'notify');
var util = require('util')





const {col_products,col_categories,col_menu,col_sliders,col_settings} = require(__path_configs + 'database');
const productsModel 		= require(__path_schemas + col_products);
const settingsModel 		= require(__path_schemas + col_settings);
const sliderModel 		= require(__path_schemas + col_sliders);
const categoryModel 		= require(__path_schemas + col_categories);
const Model 		= require(__path_models + 'products');
const menuModel 		= require(__path_schemas + col_menu);
const folderView	 = __path_view_ecommerce + 'pages/user/';
const layout	     = __path_view_ecommerce+ 'frontend';
//Profile
router.get('/profile',isLoggedIn, async (req, res, next) => {
    let item = await settingsModel.findOne({});
  
      const {copyright, content, logoFooter,phoneFooter,email,address,linkfacebook,linkyoutube} = JSON.parse(item.footer);
      const {logoHeader,phoneHeader,notification} = JSON.parse(item.header);
      
      item.copyright = copyright;
      item.content = content;
      item.address = address;
      item.phoneFooter = phoneFooter;
      item.email = email;
      item.logoFooter = logoFooter;
      item.linkfacebook=linkfacebook;
      item.linkyoutube=linkyoutube;
      item.phoneHeader = phoneHeader;
      item.notification = notification;
      item.logoHeader = logoHeader;
  
    const listProducts = await productsModel.find({}).limit(4);
    const listMenu = await menuModel.find({status:'active'}).sort({ordering: 'desc'});
    const listSliders = await sliderModel.find({status:'active'});
    const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
    res.render(`${folderView}profile`, { 
      layout,
      listProducts,
      listSliders,
      listMenu,
      item,
      listCategory,
      slider:false,
    });
});
router.get('/logout',isLoggedIn,function (req,res,next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
router.get('/',notLoggedIn,function (req,res,next) {
    next();
})
//Login
router.get('/signin',async (req, res, next) => {
  let item = await settingsModel.findOne({});

	const {copyright, content, logoFooter,phoneFooter,email,address,linkfacebook,linkyoutube} = JSON.parse(item.footer);
	const {logoHeader,phoneHeader,notification} = JSON.parse(item.header);
	
	item.copyright = copyright;
	item.content = content;
	item.address = address;
	item.phoneFooter = phoneFooter;
	item.email = email;
	item.logoFooter = logoFooter;
	item.linkfacebook=linkfacebook;
	item.linkyoutube=linkyoutube;

	item.phoneHeader = phoneHeader;
	item.notification = notification;
	item.logoHeader = logoHeader;

  const listProducts = await productsModel.find({}).limit(4);
  const listMenu = await menuModel.find({status:'active'}).sort({ordering: 'desc'});
  const listSliders = await sliderModel.find({status:'active'});
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
  res.render(`${folderView}signin`, { 
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    listCategory,
    slider:false
  });
});
router.post('/signin',
  async(req,res,next)=>{
    if(req.isAuthenticated()) res.redirect('/');
    req.body=JSON.parse(JSON.stringify(req.body));
    // console.log(req.body);
    passport.authenticate('local.signin', {
      successRedirect:'/user/profile',
      failureRedirect: '/user/signin',
      failureFlash:true,
    })(req,res,next);
});
//Register
router.get('/signup',async (req, res, next) => {
    let item = await settingsModel.findOne({});
  
      const {copyright, content, logoFooter,phoneFooter,email,address,linkfacebook,linkyoutube} = JSON.parse(item.footer);
      const {logoHeader,phoneHeader,notification} = JSON.parse(item.header);
      
      item.copyright = copyright;
      item.content = content;
      item.address = address;
      item.phoneFooter = phoneFooter;
      item.email = email;
      item.logoFooter = logoFooter;
      item.linkfacebook=linkfacebook;
      item.linkyoutube=linkyoutube;
  
      item.phoneHeader = phoneHeader;
      item.notification = notification;
      item.logoHeader = logoHeader;
  
    const listProducts = await productsModel.find({}).limit(4);
    const listMenu = await menuModel.find({status:'active'}).sort({ordering: 'desc'});
    const listSliders = await sliderModel.find({status:'active'});
    const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
    let error = []
    // if(req.flash().hasOwnProperty('error')){
    //     error.push({
    //         msg: req.flash().error,
    //         param: 'emailexits'
    //     })
    // }
    res.render(`${folderView}signup`, { 
      layout,
      listProducts,
      listSliders,
      listMenu,
      item,
      listCategory,
      error: error,
      slider:false
    });
});
router.post('/signup',
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage(notify.ERROR_REGISTER_EMAIL),
        body('username')
            .isLength({min: 2, max: 15})
            .withMessage(util.format(notify.ERROR_REGISTER_NAME,2,15)),
        body('password')
            .custom((value, { req })=>{
                let {confirmpassword, password} = req.body

                if (!confirmpassword || !password) {
                    return Promise.reject(notify.ERROR_REGISTER_PASS_INPUT)
                }
                if((confirmpassword.length<6 || confirmpassword.length>18)|| (password.length<6 || password.length>18)
                ){
                    return Promise.reject(util.format(notify.ERROR_REGISTER_PASS,6,18))
                }
                if(password != confirmpassword){
                    return Promise.reject(notify.ERROR_REGISTER_PASSCONFIRM)
                }
                return Promise.resolve()
            }),
    async(req,res,next)=>{
      if(req.isAuthenticated()) res.redirect('/');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let errorsMsg = {};
        errors.errors.forEach(value => {
          errorsMsg[value.param] = value.msg
        });
        res.render(`${folderView}signup`, { 
          errors: errorsMsg,
        });
      req.body=JSON.parse(JSON.stringify(req.body));
      // console.log(req.body);
      passport.authenticate('local.signup', {
        successRedirect:'/user/profile',
        failureRedirect: '/user/signup',
        failureFlash:true,
      })(req,res,next);
}});

module.exports = router;

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}
function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}
  
