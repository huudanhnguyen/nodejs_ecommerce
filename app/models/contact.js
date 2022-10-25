const Collection = 'contact';
const Model = require(__path_schemas + Collection);
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

module.exports = {
	getList(objWhere, pagination, {sortField, sortType}) {
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
	deleteOne(id,field = null){
			return Model.deleteOne({_id: id});
	},
	deleteMulti(arrayId){
		return Model.remove({_id: arrayId});
	},
	findById(id) {
		return Model.findById(id);
	},
	mainMail: async function (params) {
        console.log(params)
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
      
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: "gmail" ,
        //   host: "smtp.gmail.com",
        //   port: 587,
        //   secure: false, // true for 465, false for other ports
          auth: {
            user: `${process.env.EMAIL_SMTP}`, // generated ethereal user
            pass: `${process.env.PASSWORD_SMTP}`, // generated ethereal password
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: `"${params.name}" <${params.email}>`, // sender address
          to: "huudanh2001.hd@gmail.com", // list of receivers
          subject: `${params.subject}`, // Subject line
          phone: `${params.phone}`, // Subject line
          text: `${params.message}`, // plain text body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
}