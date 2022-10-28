var express = require('express');
var router 	= express.Router();
const util = require('util');
const { body, validationResult } = require('express-validator');
var slug = require('slug');

const Collection = 'discount';
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const Model 		= require(__path_models + Collection);
const ProductModel 		= require(__path_models + 'products');
const UtilsHelpers 	= require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const FileHelpers = require(__path_helpers + 'file');

const linkIndex		 = '/' + systemConfig.prefixAdmin + `/${Collection}/`;
// const pageTitleIndex = UtilsHelpers.firstLetterUppercase(Collection) + ' Management';
const pageTitleIndex = 'Quản Lý Danh Mục Sản Phẩm';

const pageTitleAdd   = pageTitleIndex + ' - Thêm';
const pageTitleEdit  = pageTitleIndex + ' - Sửa';
const folderView	 = __path_view_admin + `pages/${Collection}/`;

router.get('(/status/:status)?', async (req, res, next) => {
	let objWhere	 = {};
	let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
	let currentStatus= ParamsHelpers.getParam(req.params, 'status', 'all'); 
	let statusFilter = await UtilsHelpers.createFilterStatus(currentStatus,Collection);
	let sort = req.session;
	let listCategory = await UtilsHelpers.getCategory();
	let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 4,
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

// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 	
	
	
	Model.deleteOne(id,'avatar').then((result, err) => {
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
	let item	= {name: '', ordering: 0, status: 'novalue'};
	let errors   = null;
	let productList = await ProductModel.listItems({status: 'active'})
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors,productList});
	}else { // EDIT
		Model.findById(id).then((item) => {
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors,productList});
		})
	}
});
router.post('/change-time', 
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
		if (! errors.isEmpty()) {
			res.send({success: false, errors: errors})
			return
		}
		let {time, id} = req.body
		let changeTime = await Model.changeTime(id, time)
		res.send({success: true})
		} catch (error) {
			res.send({success: false})
			console.log(error)
		}
});


// SAVE = ADD EDIT
router.post('/save',
	body('name').notEmpty().withMessage(notify.ERROR_NAME_EMPTY),
	body('ordering').isNumeric().withMessage(notify.ERROR_ORDERING),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	// body('discount')
	// .isIn(['money','percent'])
	// .withMessage(notify.ERROR_DISCOUNT_UNIT)
	// .custom(async (val, {req}) => {
	// 		let {money_input, percent_input} = req.body
	// 		if(!val) return
	// 		if(val == 'money'){
	// 			let number = money_input.replace(/[^0-9]/g, '');
	// 			if (number < 500){
	// 				return Promise.reject(util.format(notify.ERROR_DISCOUNT_MONEY,500))
	// 			} 
	// 			return
	// 		} else{
	// 			let number = percent_input.replace(/[^0-9]/g, '');
	// 			if (number <= 0 || number > 100 ){
	// 				return Promise.reject(util.format(notify.ERROR_DISCOUNT_PERCENT,0,100))
	// 			} 
	// 			return
	// 		}
	// }),
	// body('productList')
	// 	.custom(async (val, {req}) => {
	// 	if (!val) {
	// 		return Promise.reject(util.format(notify.ERROR_DISCOUNT_LISTPRODUCT))
	// 	} else {
	// 		if (typeof val == 'string'){
	// 			try {
	// 				const doesIdExits = await ProductModel.checkExit(val)
	// 			} catch (error) {
	// 					return Promise.reject(util.format(notify.ERROR_DISCOUNT_LISTPRODUCT_INVALID))
	// 			}
	// 		} else{
	// 			try {
	// 				const doesIdExits = await serviceProduct.checkExit(val)
	// 			} catch (error) {
	// 					return Promise.reject(util.format(notify.ERROR_DISCOUNT_LISTPRODUCT_INVALID))
	// 			}
	// 		}
	// 	}
	// }),

		async function (req, res) { 
			try {
				console.log(req.body)
				let item = req.body;
				let itemData
				if(req.params.id != undefined){
					itemData = await Model.findById(req.params.id)
				}
				let {discount, money_input, percent_input} = req.body
					if(discount == 'money'){
						item.discountValue = { unit: discount, value: money_input.replace(/[^0-9]/g, '')}
					} else if(discount == 'percent') {
							item.discountValue = { unit: discount, value: percent_input.replace(/[^0-9]/g, '')}
					}
					if (typeof item.productList == 'string'){
						 item.productList = [item.productList]
					}
					const errors = validationResult(req);
					if (!errors.isEmpty()) {
						let productList = await ProductModel.getList({status: 'active'})
						let errorsMsg = {};
						errors.errors.forEach(value => {
							errorsMsg[value.param] = value.msg
						});
						res.render(`${folderView}form`, { 
							pageTitle: pageTitleEdit,
							item: itemData,
							id: req.params.id,
							item: req.body,
							errors: errorsMsg,
							productList
						});
						return;
					} 
					if(item.id){	// edit		
						Model.updateOne(item).then(() => {
							req.flash('success', notify.EDIT_SUCCESS, linkIndex);
						});
					} else { // add
						Model.addOne(item).then(()=> {
							req.flash('success', notify.ADD_SUCCESS, linkIndex);
						})
						
					}
				} catch (error) {
					console.log(error)
					res.redirect(linkIndex);
				}
});

module.exports = router;
