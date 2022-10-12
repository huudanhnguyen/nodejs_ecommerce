
const FileHelpers = require(__path_helpers + 'file');

let deletePhoto = async (id, data, Collection) => {
	const Product = require(__path_models + `${Collection}`);
	let moreImageArray = await Product.getItemByID(id)
	let dataMoreImage = data.split(",")
	dataMoreImage.shift()
	let filteredArray = moreImageArray.moreImage.filter(val => !dataMoreImage.includes(val))
	await Promise.all(dataMoreImage.map(async (item,index) => {
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