const Collection = 'order';
const Model = require(__path_schemas + Collection);
const couponModel = require(__path_models + 'coupons');
const productModel = require(__path_models + 'products');
const CodeHelpers = require(__path_helpers + 'generateotp');
const CalculatorHelpers = require(__path_helpers + 'calculatorproduct');
const CheckTimeInRangeHelper = require(__path_helpers + 'checktimeinrange');
const notify  		= require(__path_configs + 'notify');

module.exports = {
	saveItems: async (params) =>{
		let data = await Model(params).save()
		return
	},
	listItems: async (objWhere,
		currentPage,
		totalItemsPerPage,
		updatedAt
		) => {
			let data = await Model.find(objWhere)
										.skip((currentPage-1) * totalItemsPerPage)
										.limit(totalItemsPerPage)
										.sort(updatedAt)
			return data;
},

	getList(objWhere = {}, pagination = {}, {sortField, sortType} = {}) {
		let sort = sortField && sortType ? {[sortField]: sortType} : {_id: 'desc'};
		return Model
			.find(objWhere)
			.sort(sort)
			.skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
			.limit(pagination.totalItemsPerPage)
	},	
	countRow(objWhere) {
		return Model.count(objWhere).then(data => data);
	},
	changeStatus: async (id, status) =>{
        let data = await Model.findOne({_id: id})
        if(data.status > 2) return
        data.status = status
        let updateData = await Model.findOneAndUpdate({_id: id},data,{
          new: true
        })
        return updateData
      },
	updateOne({id,field,value,...restParams} = {}){
		if(!field) return Model.updateOne({_id: id}, restParams);
		return Model.updateOne({_id: id}, {[field]: value,...restParams});
	},
	updateMany({cid,...restParams},field,value,operator = '$in') {
		return Model.updateMany({_id: {[operator]: cid }}, {[field]: value,...restParams});
	},
	addOne(obj){
		return new Model(obj).save();
	},
	countItem: async (objWhere) =>{
        let data = await Model.count(objWhere)
        return data
    },
	deleteOne(id,field = null){
			return Model.deleteOne({_id: id});
	},
	deleteMulti(arrayId){
		return Model.remove({_id: arrayId});
	},
	findById(id) {
		return Model.findById(id);
	},
	getOrderByTrackingCode: async (code) =>{
		let result = await Model.findOne({trackingCode: code})
		return result
	  },
	addOrder: async (obj) =>{
		let trackingCode = CodeHelpers.generateAZ(3) + CodeHelpers.generateOTP(6)
		let errorObj = {success: false,errors:[{
		  msg: notify.PRESS_F5
		}]}
		let saveOrder = {}
					  saveOrder.name    = obj.name
					  saveOrder.userId  = obj.userId
					  saveOrder.address = obj.address
					  saveOrder.couponCode= obj.couponCode
					  saveOrder.phoneNumber = obj.phoneNumber
					  saveOrder.notes = obj.notes
					  saveOrder.trackingCode = trackingCode
		let listProduct  =  JSON.parse(obj.productOrder)
		let listProductNews = []
		let priceProduct = 0
		let data = await Promise.all(listProduct.map(async (item,index) => {
				  let product      = await productModel.getProductByIdForOrder(item.id)
				  product          = JSON.parse(JSON.stringify(product))
				  priceProduct       += product.price*item.quantity
				  product.quantity   =  item.quantity
				  return product
		   })).then((values) => {
			saveOrder.productList = JSON.stringify(values)
		  })
		  .catch((error) => {
			  console.log(error)
			  return Promise.reject(errorObj)
		  });

		if(priceProduct != obj.priceProduct) {
		  return errorObj
		} else{
		  saveOrder.priceProduct = priceProduct
		}

		let newturnused
		if(obj.couponCode){
		  let findCode = await couponModel.getCodeCoupon({status:"active", name: obj.couponCode})
		  if(findCode._doc) 
		  {   
			  let turnused = findCode._doc.turnused || 0
			  newturnused = turnused + 1
			  if(!CheckTimeInRangeHelper.checkTimeInRange(findCode._doc.dates)){
				  return errorObj
			  } else{
				saveOrder.couponCode = JSON.stringify(findCode._doc)
				let priceAfterCoupon = priceProduct + 25000 - findCode._doc.values
				if(priceAfterCoupon == obj.totalMoney){
				  saveOrder.totalMoney  = obj.totalMoney
				  saveOrder.couponValue = findCode._doc.values
				} else{
				  return errorObj
				}
			  }
		  } 
		} else{
		  let price = priceProduct + 25000
		  if(price == obj.totalMoney){
			saveOrder.totalMoney  = obj.totalMoney
		  } else{
			return errorObj
		  }
		}
		console.log(saveOrder);
		// await serviceCoupon.editTurnUsed({status:"active", couponcode: obj.couponCode}, newturnused)
		 await module.exports.addOne(saveOrder)
		// await module.exports.sendMailOrderSuccess(obj, trackingCode)
		return {success: true, trackingCode: trackingCode }
	  },
	  sendMailOrderSuccess: async function (params, trackingCode) {
		  // Generate test SMTP service account from ethereal.email
		  // Only needed if you don't have a real mail account for testing
		  let testAccount = await nodemailer.createTestAccount();
		  let setting = await serviceSetting.getOne()
		  let settingObj = JSON.parse(setting.setting)
		  let listReceiversObj = settingObj.main_email + ',' + settingObj.sub_email
		  // create reusable transporter object using the default SMTP transport
		  let transporter = nodemailer.createTransport({
			service: "gmail" ,
		  //   host: "smtp.gmail.com",
		  //   port: 587,
		  //   secure: false, // true for 465, false for other ports
			auth: {
			  user: process.env.EMAIL_SMTP, // generated ethereal user
			  pass: process.env.PASSWORD_SMTP, // generated ethereal password
			},
		  });
		  // send mail with defined transport object
		  let infoForClient = await transporter.sendMail({
			from: `"${settingObj.title}" <${settingObj.main_email}>`, // sender address
			to: `${params.email}`, // list of receivers
			subject: notify.EMAIL_ORDER_SUCCESS_SUBJECT, // Subject line
			// text: settingObj.content_email, // plain text body
			html: notify.EMAIL_ORDER_SUCCESS_CONTENT + trackingCode, // html body
		  });
  
		  let infoForMember = await transporter.sendMail({
			from: `"${params.name}" <${params.email}>`, // sender address
			to: `${listReceiversObj}`, // list of receivers
			subject: notify.EMAIL_INFORM_ORDER_SUCCESS_SUBJECT, // Subject line
			html: notify.EMAIL_INFORM_ORDER_SUCCESS_CONTENT + trackingCode, // html body
		  });
		},
	  lastestOrder: async (number) =>{
		  let data = await modelOrder.find({}).sort({createdAt: 'desc'}).limit(number)
		  return data
	  }
	
}