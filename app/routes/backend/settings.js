var express = require('express');
var router 	= express.Router();
const util = require('util');
const { body, validationResult } = require('express-validator');

const Collection = 'settings';
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const Model 		= require(__path_schemas + Collection);

const UtilsHelpers 	= require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const FileHelpers = require(__path_helpers + 'fields');

const linkIndex		 = '/' + systemConfig.prefixAdmin + `/${Collection}/`;
const pageTitleIndex = UtilsHelpers.firstLetterUppercase(Collection) + ' Management';
const folderView	 = __path_view_admin + `pages/${Collection}/`;
const uploadAvatar	 = FileHelpers.upload([
	{name:'logoHeader', maxCount: 1},
	{name:'logoFooter', maxCount:1}
], Collection);

router.get(('/'),async (req, res, next) => {
	let errors   = null;
	let item = await Model.findOne({});

	const {copyright, content, logoFooter} = JSON.parse(item.footer);
	const {logoHeader} = JSON.parse(item.header);
	
	item.copyright = copyright;
	item.content = content;
	item.logoFooter = logoFooter;
	item.logoHeader = logoHeader;
	console.log(item.footer);
	res.render(`${folderView}form`, { pageTitle: pageTitleIndex, item, errors,});
});

// SAVE = ADD EDIT
router.post('/save',uploadAvatar,
	body('copyright').notEmpty().withMessage(notify.ERROR_TITLE_EMPTY),
	body('logoHeader').custom((value,{req}) => {
		const {image_header_uploaded,image_header_old} = req.body;
		if(!image_header_uploaded && !image_header_old) {
			return Promise.reject(notify.ERROR_FILE_EMPTY);
		}
		if(!req.files.logoHeader && image_header_uploaded) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
		}
		return true;
	}),
	body('logoFooter').custom((value,{req}) => {
		const {image_footer_uploaded,image_footer_old} = req.body;
		if(!image_footer_uploaded && !image_footer_old) {
			return Promise.reject(notify.ERROR_FILE_EMPTY);
		}
		if(!req.files.logoFooter && image_footer_uploaded) {
				return Promise.reject(notify.ERROR_FILE_EXTENSION);
		}
		return true;
	}),
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorsMsg = {};
			errors.errors.forEach(value => {
				errorsMsg[value.param] = value.msg
			});
			console.log(errors)
			req.body.logoHeader = req.body.image_header_old;
			req.body.logoFooter = req.body.image_footer_old;
			res.render(`${folderView}form`, { 
				pageTitle: pageTitleIndex, 
				item: req.body,
				errors: errorsMsg,
			});
			return;
		} 

		let item = req.body;
		let footer = JSON.stringify({
			copyright: item.copyright,
			content: item.content,
			logoFooter: !req.files.logoFooter ? item.image_footer_old : req.files.logoFooter[0].filename
		})
		let header = JSON.stringify({
			logoHeader:!req.files.logoHeader ? item.image_header_old : req.files.logoHeader[0].filename
		});
		if(req.files.logoHeader) FileHelpers.remove(`public/uploads/${Collection}/`, item.image_header_old);
		if(req.files.logoFooter) FileHelpers.remove(`public/uploads/${Collection}/`, item.image_footer_old);
		Model.update({_id:item.id},{header,footer}).then(() => {
			req.flash('success','Cap nhat thanh cong', linkIndex);
		})
});

module.exports = router;
