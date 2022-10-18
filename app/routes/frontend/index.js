var express = require('express');
var router = express.Router();

router.use('/',require('./home'));
router.use('/auth', require('./auth'));
router.use('/category', require('./category'));
router.use('/product', require('./product'));
module.exports = router;
