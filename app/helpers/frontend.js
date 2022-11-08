
const NewsletterModel  = require(__path_models + 'newsletter');
const CategoryModel  = require(__path_models + 'categories');

let sendMailLetter  = async (item) =>{
  let data = await NewsletterModel.sendMailLetter(item)
  return data
}

let saveNewsletter   = async (item) =>{
  let dataDuplicated = await NewsletterModel.checkDuplicated({email: item.email})
  if (dataDuplicated) return
  let data = await NewsletterModel.addOne(item)
  return data
}
let getProductByCategory = async (id, rangePrice, sort) =>{
  let data = await CategoryModel.getProductByCategory(id, rangePrice, sort)
  return data
}


module.exports = {
  sendMailLetter,
  saveNewsletter,
  getProductByCategory
}