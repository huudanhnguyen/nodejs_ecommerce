const CheckTimeInRangeHelper = require(__path_helpers + 'checktimeinrange');

let findDiscount = (dataShow, money) =>{
      if(!dataShow) return
      let activeData = dataShow.filter(item => item.status === 'active' && CheckTimeInRangeHelper.checkTimeInRange(item.time)==true)
      let listMoney = activeData.filter(item => item.discountValue.unit == 'money')
      let listPercent = activeData.filter(item => item.discountValue.unit == 'percent')
      let maxMoney, maxPercent
      if(listMoney.length>0) maxMoney      = listMoney.reduce((max, item)=> max.value > item.value ? max : item)
      if(listPercent.length>0) maxPercent  = listPercent.reduce((max, item)=> max.value > item.value ? max : item)
      if(maxMoney && maxPercent){
        if(maxMoney.discountValue.value > (maxPercent.discountValue.value*money/100)){
          return maxMoney
        }else {
          return maxPercent
        }
      } else if(maxMoney && !maxPercent){
          return maxMoney
      } else if(!maxMoney && maxPercent){
          return maxPercent
      }
}

let productPrice = (price, discount) =>{
  if(!price) return
  if(!discount){
    return price
  } else {
    if(discount.discountValue.unit == 'money'){
      let newPriceMoney = price - discount.discountValue.value
      return newPriceMoney
    } else{
      let newPricePercent = price - discount.discountValue.value*price/100
      newPricePercent = parseInt(newPricePercent/1000)*1000
      return newPricePercent
    }
  }
}

module.exports = {
	findDiscount,
  productPrice,
}