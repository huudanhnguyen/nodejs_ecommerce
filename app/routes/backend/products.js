var express = require('express');
var router 	= express.Router();
const util = require('util');
const { body, validationResult } = require('express-validator');
var slug = require('slug');

const Collection = 'products';
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const Model 		= require(__path_models + Collection);
const attributeModel  = require(__path_schemas + 'attributes');

const UtilsHelpers 	= require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const FileHelpers = require(__path_helpers + 'file');

const linkIndex		 = '/' + systemConfig.prefixAdmin + `/${Collection}/`;
const pageTitleIndex = UtilsHelpers.firstLetterUppercase(Collection) + ' Management';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';
const folderView	 = __path_view_admin + `pages/${Collection}/`;
const uploadImage	 = FileHelpers.upload('fileMulti', Collection);

// List items
router.get('(/status/:status)?', async (req, res, next) => {
	let objWhere	 = {};
	let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus= ParamsHelpers.getParam(req.params, 'status', 'all'); 
	let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus,Collection);
	let sort = req.session;
	let listCategory = await UtilsHelpers.getCategory();
	let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 10,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};

	if(currentStatus !== 'all') objWhere.status = currentStatus;
	if(keyword !== '') objWhere.name = new RegExp(keyword, 'i');
	pagination.totalItems = await Model.countRow(objWhere);

	Model
		.getList(objWhere,pagination,sort)
		.then( (items) => {
			res.render(`${folderView}list`, { 
				pageTitle: pageTitleIndex,
				items,
				statusFilter,
				pagination,
				currentStatus,
				keyword,
				sort,
				listCategory
			});
		});
});
// ajax
router.post('/ajax', (req, res, next) => {
	req.body.modified = {userId: 0,username: 'admin',time: Date.now()};
	Model.updateOne(req.body).then(() => {
		res.send(req.body);
	});
});
//slug
router.post('/slug', (req, res, next) => {
	res.send(JSON.stringify(slug(req.body.value)));
});
// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	req.body.modified = {userId: 0,username: 'admin',time: Date.now()};
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	Model.updateMany(req.body,'status',currentStatus).then((result, err ) => {
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, result.n) , linkIndex);
	});
});
// Sort
router.get('/sort/:field/:type', (req, res, next) => {
	req.session.sortField = req.params.field;
	req.session.sortType = req.params.type;
	res.redirect(linkIndex)
});
// Change ordering - Multi
// router.post('/change-ordering', (req, res, next) => {
// 	let cids 		= req.body.cid;
// 	let orderings 	= req.body.ordering;
	
// 	if(Array.isArray(cids)) {
// 		cids.forEach((item, index) => {
// 			SlidersModel.updateOne({_id: item}, {ordering: parseInt(orderings[index])}, (err, result) => {});
// 		})
// 	}else{ 
// 		SlidersModel.updateOne({_id: cids}, {ordering: parseInt(orderings)}, (err, result) => {});
// 	}

// 	req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
// 	res.redirect(linkIndex);
// });

// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 	
	
	
	Model.deleteOne(id,'thumbnail').then((result, err) => {
		req.flash('success', notify.DELETE_SUCCESS, linkIndex);
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	Model.deleteMulti(req.body.cid).then((result, err) => {
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS, result.n), linkIndex);
	});
});

// FORM
router.get(('/form(/:id)?'),async (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let errors   = null;
	let listCategory = await UtilsHelpers.getCategory();
	let listAttributes = await attributeModel.find({status: 'active'}).select('name id');
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item : {attributes: ''}, errors,listCategory,listAttributes});
	}else { // EDIT
		Model.findById(id).then((item) => {
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors,listCategory,listAttributes});
		})
	}
});

// SAVE = ADD EDIT
router.post('/save',uploadImage,
	body('name').notEmpty().withMessage(notify.ERROR_TITLE_EMPTY),
	body('categoriesId').not().isIn(['novalue']).withMessage(notify.ERROR_Category),
	body('slug').matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage(notify.ERROR_SLUG),
	body('ordering').isNumeric().withMessage(notify.ERROR_ORDERING),
	body('price').isNumeric().withMessage(notify.ERROR_PRICE),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	async (req, res, next) => {

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorsMsg = {};
			errors.errors.forEach(value => {
				errorsMsg[value.param] = value.msg
			});
			let item = req.body;
			item.information = UtilsHelpers.mappingInfomation(item);
			let listCategory = await UtilsHelpers.getCategory();
			let listAttributes = await attributeModel.find({status: 'active'}).select('name id');

			res.render(`${folderView}form`, { 
				pageTitle: pageTitleEdit, 
				item,
				errors: errorsMsg,
				listCategory,
				listAttributes
			});
			return;
		} 

		let item = req.body;
		// item.information = UtilsHelpers.mappingInfomation(item);
		if(item.id){	// edit	
			Model.updateOne(item).then(() => {
				req.flash('success', notify.EDIT_SUCCESS, linkIndex);
			});
		} else { // add
			Model.addOne(item).then(()=> {
				req.flash('success', notify.ADD_SUCCESS, linkIndex);
			})
			
		}	
	// });
});
router.post('/upload',uploadImage, async (req, res, next) => { 
	if(!req.file) {
		return res.status(422).send('File không hợp lệ');
	} else {
		return res.status(200).send(req.file);
	}	
});
module.exports = router;
