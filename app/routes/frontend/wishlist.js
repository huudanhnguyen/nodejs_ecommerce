const express = require('express');
const router = express.Router();
var fs = require('fs');
const Cart = require('../../models/frontend/cart');


const {col_products,col_menu,col_settings,col_categories} = require(__path_configs + 'database');
const productsModel 		= require(__path_schemas + col_products);
const ParamsHelpers = require(__path_helpers + "params");
const settingsModel 		= require(__path_schemas + col_settings);
const categoryModel 		= require(__path_schemas + col_categories);

const Model 		= require(__path_models + 'products');
const menuModel 		= require(__path_schemas + col_menu);
const folderView	 = __path_view_ecommerce + 'pages/wishlist/';
const layout	     = __path_view_ecommerce+ 'frontend';
/* GET home page. */
router.get('/add/:id', async function(req, res, next) {
  let productId 		= ParamsHelpers.getParam(req.params, 'id', '');
  productsModel.findOne({id:productId},function(err,p){
    if(err)
    console.log(err);
    if(typeof req.session.cart=="undefined"){
      req.session.cart=[];
      req.session.cart.push({

      })
    }
  })


});
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

  const listProducts = await productsModel.find({}).limit();

  const listMenu = await menuModel.find({status:'active'}).sort({ordering: 'desc'});
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });

  res.render(`${folderView}index`, { 
    layout,
    listMenu,
    item,
    listProducts,
    listCategory,
    slider:false
  });
});


module.exports = router;
