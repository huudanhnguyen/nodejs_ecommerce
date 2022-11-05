var express = require('express');
const passport = require('passport');
var router = express.Router();

const {col_products,col_categories,col_menu,col_sliders,col_settings,col_users} = require(__path_configs + 'database');
const productsModel 		= require(__path_schemas + col_products);
const usersModel 		= require(__path_schemas + col_users);
const settingsModel 		= require(__path_schemas + col_settings);
const sliderModel 		= require(__path_schemas + col_sliders);
const categoryModel 		= require(__path_schemas + col_categories);
const Model 		= require(__path_models + 'products');
const menuModel 		= require(__path_schemas + col_menu);
const folderView	 = __path_view_ecommerce + 'pages/user/';
const layout	     = __path_view_ecommerce+ 'frontend';
/* GET home page. */
router.get('/',async (req, res, next) => {
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
  res.render(`${folderView}signup`, { 
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    listCategory,
    slider:false
  });
});

// router.post('/', 
//   passport.authenticate('local.signup', { failureRedirect: '/user/signup' }),
//   function(req, res) {
//     res.redirect('/user/profile');
// });
router.post('/', 
  passport.authenticate('local.signup', {
    successRedirect:'user/profile',
    failureRedirect: '/user/signup',
    failureFlash:true
}));




module.exports = router;
