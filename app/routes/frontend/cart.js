const express = require('express');
const router = express.Router();
var fs = require('fs');
const Cart = require('../../models/frontend/cart');


const {col_products,col_menu,col_settings,col_categories} = require(__path_configs + 'database');
const productsModel 		= require(__path_schemas + col_products);
const settingsModel 		= require(__path_schemas + col_settings);
const categoryModel 		= require(__path_schemas + col_categories);

const Model 		= require(__path_models + 'products');
const menuModel 		= require(__path_schemas + col_menu);
const folderView	 = __path_view_ecommerce + 'pages/cart/';
const layout	     = __path_view_ecommerce+ 'frontend';
/* GET home page. */
router.get('/add/:id', async function(req, res, next) {
  const listProducts = await productsModel.find({}).limit();
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = listProducts.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.redirect('/');
  console.log(product);
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

  if (!req.session.cart) {
    return res.render(`${folderView}index`, {
      layout,
      listMenu,
      listCategory,
      listProducts,
      item,
      slider:false
    });
  }
  res.render(`${folderView}index`, { 
    layout,
    listMenu,
    item,
    listProducts: cart.getItems(),
    totalPrice: cart.totalPrice,
    slider:false
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

module.exports = router;
