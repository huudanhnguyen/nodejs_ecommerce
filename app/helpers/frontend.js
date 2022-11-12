
const NewsletterModel  = require(__path_models + 'newsletter');
const UserModel  = require(__path_models + 'users');

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
let updateInfoUser = async (obj)=>{
  let result = await UserModel.updateInfoUser(obj)
  return result
}


module.exports = {
  sendMailLetter,
  saveNewsletter,
  updateInfoUser
}