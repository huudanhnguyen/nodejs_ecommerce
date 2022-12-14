const Collection = 'users';
const Model = require(__path_schemas + Collection);
const FileHelpers = require(__path_helpers + 'file');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
	getList(objWhere, pagination, {sortField, sortType}) {
		let sort = sortField && sortType ? {[sortField]: sortType} : {_id: 'desc'};
		return Model
			.find(objWhere)
			.sort(sort)
			.skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
			.limit(pagination.totalItemsPerPage)
	},
	getItemByEmail: (email, options = null) => {
        if(options == null) {
            return Model.findOne({email: email})                 
        } 
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
		if(field) {
			return Model.findById(id).select(field).then(data => {
				FileHelpers.remove(`public/uploads/${Collection}/`, data[field]);
			}).then(() => Model.deleteOne({_id: id}));
		} else {
			return Model.deleteOne({_id: id});
		}
		
	},
	deleteMulti(arrayId){
		return Model.remove({_id: arrayId});
	},
	findById(id) {
		return Model.findById(id);
	},
	saveUser: async (obj)=>{
		return await Model(obj).save()
	},
	updateInfoUser: async (obj)=>{
        let result = await Model.updateOne({email: obj.email}, {
            username: obj.username,
            phone: obj.phone,
            address: obj.address,

		})
        return result
    },
	updatePasswordUser: async (obj) =>{
        let email = obj.email
        let newPassword = obj.password
        let user  = await Model.findOne({email: email})
        let oldPassword = user.password
        let CheckPassNew = await bcrypt.compare(newPassword,oldPassword);
        if(CheckPassNew){
            return {success: false, errors: [{msg:'M???t Kh???u M???i kh??ng ???????c Tr??ng v???i M???t Kh???u C??'}]}
        } else{
            let salt = await bcrypt.genSalt(saltRounds);
            let hashPassword = await bcrypt.hash(newPassword, salt);
            let data = await Model.updateOne({email: email}, {password: hashPassword})
            return {success: true}
        }
    },
}