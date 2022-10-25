var express = require('express');
var router = express.Router();

const {col_products,col_categories,col_menu,col_sliders,col_settings} = require(__path_configs + 'database');
const productsModel 		= require(__path_schemas + col_products);
const settingsModel 		= require(__path_schemas + col_settings);
const sliderModel 		= require(__path_schemas + col_sliders);
const categoryModel 		= require(__path_schemas + col_categories);
const ParamsHelpers = require(__path_helpers + "params");
const Model 		= require(__path_models + 'products');
const menuModel 		= require(__path_schemas + col_menu);
const folderView	 = __path_view_ecommerce + 'pages/product/';
const layout	     = __path_view_ecommerce+ 'frontend';
/* GET home page. */
// router.get('/(:slug)?',async (req, res, next) => {
router.get("/:id", async (req, res, next) => {
  let idProduct = ParamsHelpers.getParam(req.params, 'id', '');
  let itemProduct = {};
  await Model.getItemFrontend(idProduct, null).then((itemPro) => {
    itemProduct = itemPro;
  });

  // let itemsSpecial 	= [];
  // await Model.listItemsFrontend(null, {task: 'items-special'} ).then( (items) => { itemsSpecial = items;
  //   items.map(async i=>{
  //     let{name}=await categoryModel.findById((i.categoriesId))
  //       i.categoryName=name;
  //       return i
  //     })
  //     items= itemsSpecial;
  // });
  // await Model.listItemsFrontend(null, {task: 'items-ecommerce'} ).then( (items) => { itemsEcommerce = items;
  //   items.map(async i=>{
  //     let{name}=await categoryModel.findById((i.categoriesId))
  //       i.categoryName=name;
  //       return i
  //     })
  //     itemsEcommerce=items; 
  // });
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
  let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');

  let itemsInCategory	= [];
  await Model.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsInCategory = items; });

  const listProducts = await productsModel.find({}).limit(4);
  const itemsCate = await productsModel.find({id: idCategory});
  const listProductBestSeller = await productsModel.find({bestseller:true,status:'active'});
  const listProductNewArrivals = await productsModel.find({newarrivals:true,status:'active'});
  const listMenu = await menuModel.find({status:'active'}).sort({ordering: 'desc'});
  const listSliders = await sliderModel.find({status:'active'});
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
  res.render(`${folderView}index`, { 
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    itemProduct,
    itemsCate,
    itemsInCategory,
    listProductBestSeller,
    listProductNewArrivals,
    // itemsSpecial,
    // itemsEcommerce,
    listCategory,
    slider:false
  });
});

module.exports = router;
