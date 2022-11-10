
const NewsletterModel  = require(__path_models + 'newsletter');

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


module.exports = {
  sendMailLetter,
  saveNewsletter,
}