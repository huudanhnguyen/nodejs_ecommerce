
const NewsletterModel  = require(__path_models + 'newsletter');
const UserModel  = require(__path_models + 'users');
const CouponsModel  = require(__path_models + 'coupons');
const OrderModel  = require(__path_models + 'order');

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
let updatePasswordUser = async (obj)=>{
  let result = await UserModel.updatePasswordUser(obj)
  return result
}
let getListCoupon = async () =>{
  let data = await CouponsModel.getListCoupon()
  if (!data) return
  return data
}
let getCodeCoupon = async (obj)=>{
  let result = await CouponsModel.getCodeCoupon(obj)
  return result
}
let addOrder = async (obj) =>{
  let result = await OrderModel.addOrder(obj)
  return result
}

let getOrderByTrackingCode = async (code) =>{
  let result = await OrderModel.getOrderByTrackingCode(code)
  return result
}


module.exports = {
  sendMailLetter,
  saveNewsletter,
  updateInfoUser,
  updatePasswordUser,
  getListCoupon,
  getCodeCoupon,
  getOrderByTrackingCode,
  addOrder,
}