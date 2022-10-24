var express = require('express');
var router = express.Router();

router.use('/',require('./home'));
router.use('/auth', require('./auth'));
router.use('/category', require('./category'));
router.use('/lien-he', require('./contact'));
router.use('/gioi-thieu', require('./about'));
router.use('/product', require('./product'));
router.use('/tat-ca-san-pham', require('./listProduct'));
router.use('/dang-nhap', require('./login'));
router.use('/dang-ky', require('./register'));
router.use('/search', require('./search'));

module.exports = router;
