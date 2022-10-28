const Collection = 'discount';
const Model = require(__path_schemas + Collection);
const FileHelpers = require(__path_helpers + 'file');
const CategoriesModel = require(__path_schemas + 'categories');
const modelProduct = require(__path_schemas + 'products');
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
    addOne: async (params) =>{
        let data = await Model(params).save(async function(err,room) {
                    let productListSelect = params.productList
                    await Promise.all(productListSelect.map(async (id,index) => {
                        let findObject = await modelProduct.findOne({_id: id}).then( async (obj)=>{
                            obj.discountProduct.push(room.id)
                            await modelProduct(obj).save()
                    })
                 }))
                .catch((error) => {
                    console.error(error.message)
                    return Promise.reject()
                });
            return
         })
        return 
        },
		deleteOne: async (id) =>{
			let removeObject = await Model.findOne({_id: id}).then( async (objDiscount)=>{
				let productList = await objDiscount.productList
				let delele = await Promise.all(productList.map(async (idProduct,index) => {
						let findObject = await modelProduct.findOne({_id: idProduct}).then( async (objProduct)=>{
							await objProduct.discountProduct.remove(id)
							await modelProduct(objProduct).save()
						})
						return
				}))
				.then(async ()=>{
					let data = await Model.deleteOne({_id: id})
				})
				.catch((error) => {
					console.error(error.message)
					return Promise.reject(error)
				});
			})
			return
		},
	deleteMulti(arrayId){
		return Model.remove({_id: arrayId});
	},
	findById(id) {
		return Model.findById(id);
	},
	changeTime: async (id, time) =>{
        let data = await Model.updateOne({_id: id}, {time: time})
        return
    },
	checkDuplicated: async (val) =>{
        let data = await Model.find(val)
        return data
    },
}