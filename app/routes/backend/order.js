var express = require('express');
var router 	= express.Router();
const util = require('util');
const { body, validationResult } = require('express-validator');
var slug = require('slug');

const Collection = 'order';
const systemConfig  = require(__path_configs + 'system');
const notify  		= require(__path_configs + 'notify');
const Model 		= require(__path_models + Collection);

const UtilsHelpers 	= require(__path_helpers + 'utils');
const ParamsHelpers = require(__path_helpers + 'params');
const Libs = require(__path_configs + 'libs');
const FileHelpers = require(__path_helpers + 'file');


const linkIndex		 = '/' + systemConfig.prefixAdmin + `/${Collection}/`;
const pageTitleIndex = UtilsHelpers.firstLetterUppercase(Collection) + ' Management';
const pageTitleAdd   = pageTitleIndex + ' - Add';
const pageTitleEdit  = pageTitleIndex + ' - Edit';
const folderView	 = __path_view_admin + `pages/${Collection}/`;

router.get('(/status/:status)?', async (req, res, next) => {
	try {
		let inform = req.flash()
    let objWhere = {};
    let keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
    let currentStatus = ParamsHelpers.getParamOrder(req.params, 'status', 'all');
		console.log(currentStatus)
    let statusFilter = await UtilsHelpers.createFilterStatusOrder(currentStatus, Collection);
    let pagination = {
        totalItems: 1,
        totalItemsPerPage: 10,
        currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
        pageRanges: 3
    };

    if (currentStatus !== 'all') objWhere.status = currentStatus;
    if (keyword !== '') objWhere.phoneNumber = new RegExp(keyword, 'i');
    pagination.totalItems = await Model.countItem(objWhere);
			let data = await Model.listItems(objWhere, 
				pagination.currentPage,
				pagination.totalItemsPerPage,
				{updatedAt: 'desc'},
			)
			res.render(`${folderView}list`, {
				pageTitle: pageTitleIndex,
				items: data,
				statusFilter,
				pagination,
				currentStatus,
				keyword,
				inform: inform,
				statusOrder: Libs.statusOrder,
			})
	} catch (error) {
		console.log(error)
	}
})
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

router.post('/change-status/',
	body('status')
		.isInt({min: 0, max: 5})
		.withMessage(notify.ERROR_ORDER_STATUS),
	async (req, res, next) => {
	try {
			let errors = await validationResult(req)
			if(!errors.isEmpty()) {
				res.send({success: false, errors: errors.errors})
				return
			}
			let {status, id} = req.body
			let changeStatus = await Model.changeStatus(id, status)
			console.log(changeStatus)
			if(changeStatus){
				res.send({success: true, data: changeStatus, status: Libs.statusOrder[status]})
			} else{
				res.send({success: false, errors:[{msg: notify.ERROR_ORDER_STATUS_CHANGE}]})
			}
	} catch (error) {
			console.log(error)
			res.send({success: false, errors:[{msg: notify.PRESS_F5_BE}]})
	}

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
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, item, errors});
	}else { // EDIT
		Model.findById(id).then((item) => {
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors});
		})
	}
});

// SAVE = ADD EDIT
router.post('/save',
	body('name').notEmpty().withMessage(notify.ERROR_NAME_EMPTY),
	body('ordering').isNumeric().withMessage(notify.ERROR_ORDERING),
	body('status').not().isIn(['novalue']).withMessage(notify.ERROR_STATUS),
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorsMsg = {};
			errors.errors.forEach(value => {
				errorsMsg[value.param] = value.msg
			});
			res.render(`${folderView}form`, { 
				pageTitle: pageTitleEdit, 
				item: req.body,
				errors: errorsMsg,
			});
			return;
		} 
		let item = req.body;
		if(item.id){	// edit		
			Model.updateOne(item).then(() => {
				req.flash('success', notify.EDIT_SUCCESS, linkIndex);
			});
		} else { // add
			Model.addOne(item).then(()=> {
				req.flash('success', notify.ADD_SUCCESS, linkIndex);
			})
			
		}	
});

module.exports = router;
