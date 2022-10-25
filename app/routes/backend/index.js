var express = require('express');
var router = express.Router();
const middleAuthentication = require(__path_middleware + 'auth');

router.use('/' ,require('./dashboard'));
router.use('/dashboard', require('./dashboard'));
router.use('/products', require('./products'));
router.use('/sliders', require('./sliders'));
router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/attributes', require('./attributes'));
router.use('/articles', require('./articles'));
router.use('/menu', require('./menu'));
router.use('/rss', require('./rss'));
router.use('/contact', require('./contact'));
router.use('/settings', require('./settings'));
router.use('/blogArticle', require('./blogArticle'));
router.use('/blogCategory', require('./blogCategory'));
module.exports = router;
