var express = require('express');
var router = express.Router();
const {countCollection} 	= require(__path_helpers + 'utils');
const folderView	 = __path_view_admin + 'pages/dashboard/';
const ProductsModel 	= require(__path_schemas + 'products');
const SlidersModel 	= require(__path_schemas + 'sliders');
const CategoriesModel 	= require(__path_schemas + 'categories');
const BlogArticleModel 	= require(__path_schemas + 'blogArticle');
const UsersModel 	= require(__path_schemas + 'users');
const MenuModel 	= require(__path_schemas + 'menu');
const ContactModel 	= require(__path_schemas + 'contact');
const RssModel 	= require(__path_schemas + 'rss');
/* GET dashboard page. */
router.get('/', async(req, res, next) => {
	let collectionModel = {
		'Sliders': SlidersModel,
		'Sản Phẩm': ProductsModel,
		'Tài Khoản': UsersModel,
		'Danh Mục Sản Phẩm': CategoriesModel,
		'Bài Viết': BlogArticleModel,
		'Menu': MenuModel,
		'Tin Nhắn': ContactModel,
		'Rss' : RssModel
	};
	collectionModel = await countCollection(Object.keys(collectionModel),collectionModel);
	res.render(`${folderView}index`, { 
		pageTitle: 'Bảng Điều Khiển', 
		count: collectionModel
	});
});

module.exports = router;
