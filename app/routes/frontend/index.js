var express = require('express');
var router = express.Router();

router.use('/',require('./home'));
router.use('/auth', require('./auth'));
router.use('/danh-muc', require('./category'));
router.use('/lien-he', require('./contact'));
router.use('/gioi-thieu', require('./about'));
router.use('/san-pham', require('./product'));
router.use('/tat-ca-san-pham', require('./listProduct'));
router.use('/dang-nhap', require('./login'));
router.use('/dang-ky', require('./register'));
router.use('/search', require('./search'));
router.use('/bai-viet', require('./listBlog'));
router.use('/chi-tiet-bai-viet', require('./blogArticle'));
router.use('/cart', require('./cart'));
router.use('/thanh-toan', require('./checkout'));



module.exports = router;
