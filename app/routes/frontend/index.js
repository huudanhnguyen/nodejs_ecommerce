var express = require('express');
var router = express.Router();
const Cart = require('../../models/frontend/cart');
const middleAuthentication = require(__path_middleware + 'auth');
const middlewareGetUser    = require(__path_middleware + 'get-user-info')


router.use('/',middlewareGetUser, require('./home'));
router.use('/error', require('./error'));
router.use('/danh-muc', require('./category'));
router.use('/lien-he', require('./contact'));
router.use('/gioi-thieu', require('./about'));
router.use('/san-pham', require('./product'));
router.use('/tat-ca-san-pham', require('./listProduct'));
router.use('/user', require('./user'));
router.use('/search', require('./search'));
router.use('/bai-viet', require('./listBlog'));
router.use('/chi-tiet-bai-viet', require('./blogArticle'));
router.use('/wishlist', require('./wishlist'));
router.use('/thanh-toan', require('./checkout'));
router.use('/don-mua', require('./order'));
router.use('/theo-doi-don-hang', require('./orderTracking'));
router.use('/cart',middleAuthentication,require('./cart'));




module.exports = router;
