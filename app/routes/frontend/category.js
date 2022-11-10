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
const folderView	 = __path_view_ecommerce + 'pages/category/';
const layout	     = __path_view_ecommerce+ 'frontend';
/* GET home page. */
// router.get('/(:slug)?',async (req, res, next) => {
router.get("/:id", async (req, res, next) => {

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
  let filterPrice       = (req.query.minPrice && req.query.maxPrice) ? {minPrice: req.query.minPrice, maxPrice:req.query.maxPrice} :  undefined
  let sortPrice     = undefined
  if(req.query.sort){
      let dataSort      = req.query.sort.split(",")
      sortPrice     = ((dataSort[0] == 'price') && (dataSort[1] =='asc' || dataSort[1] =='desc'))? {key:dataSort[0], value: dataSort[1] } : undefined
  }
  let itemsInCategory	= [];
  await Model.listItemsFrontend({id: idCategory}, {task: 'items-in-category'}, filterPrice, sortPrice).then( (items) => { itemsInCategory = items; });

  const listProducts = await productsModel.find({}).limit(4);
  const listProductNewArrivals = await productsModel.find({newarrivals:true,status:'active'});
  const listMenu = await menuModel.find({status:'active'}).sort({ordering: 'desc'});
  const listSliders = await sliderModel.find({status:'active'});
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
  let queryPrice = (req.query.minPrice && req.query.maxPrice) ? filterPrice : {}
 
  res.render(`${folderView}index`, { 
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    itemsInCategory,
    listProductNewArrivals,
    listCategory,
    slider:false,
    queryPrice,
    idCategory,
  });
});

module.exports = router;
