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
const folderView	 = __path_view_ecommerce + 'pages/listProduct/';
const layout	     = __path_view_ecommerce+ 'frontend';
const UtilsHelpers 	= require(__path_helpers + 'utils');
const FrontEndHelpers = require(__path_helpers + 'frontend');
/* GET home page. */
router.get('/(:slug)?',async (req, res, next) => {

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
  
  let pagination = {
    totalItems: 1,
    totalItemsPerPage: 4,
    currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
    pageRanges: 3
};

  let filterPrice       = (req.query.minPrice && req.query.maxPrice) ?[
    {price: {$gte: req.query.minPrice}},
    {price: {$lte: req.query.maxPrice}}
  ] :  undefined
  let sortPrice     = {}
  if(req.query.sort){
      let dataSort      = req.query.sort.split(",")
      sortPrice[dataSort[0]]     = ((dataSort[0] == 'price') && (dataSort[1] =='asc' || dataSort[1] =='desc'))? dataSort[1] : ''
  }

  let queryPrice = (req.query.minPrice && req.query.maxPrice) ? filterPrice : {}

  const listProductNewArrivals = await productsModel.find({newarrivals:true,status:'active'});
  const listMenu = await menuModel.find({status:'active'}).sort({ordering: 'desc'});
  const listSliders = await sliderModel.find({status:'active'});
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
  let objWhere={status:'active'}
  if(filterPrice){
    objWhere.$and= filterPrice
  }
  pagination.totalItems = await FrontEndHelpers.countProduct(objWhere);

  const listProducts = await productsModel.find(objWhere).limit().sort(sortPrice);
  res.render(`${folderView}index`, { 
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    listProductNewArrivals,
    listCategory,
    queryPrice,
    pagination,
    slider:false
  });
});

module.exports = router;
