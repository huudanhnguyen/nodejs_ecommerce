const FileHelpers = require(__path_helpers + 'file');

let deletePhoto = async (id, data, Collection) => {
	const Product = require(__path_models + `${Collection}`);
	let thumbArray = await Product.getItemByID(id)
	let dataThum = data.split(",")
	dataThum.shift()
	let filteredArray = thumbArray.thumb.filter(val => !dataThum.includes(val))
	await Promise.all(dataThum.map(async (item,index) => {
		await FileHelpers.remove(`public/uploads/${Collection}/`, item);
  }))
  .catch((error) => {
    console.error(error.message)
    return error
  });
	return filteredArray
}

module.exports = {
	deletePhoto
}