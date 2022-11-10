$(document).ready(function() {
    const localLOVE = "LIST_LOVE"
    const localCART = "LIST_CART"
    const pathname = window.location.pathname.split("/")[1];

    let loadStorage = (local) => {
        return JSON.parse(localStorage.getItem(local)) ;
    }
  
    let saveStorage = (local, items) => {
        localStorage.setItem(local, JSON.stringify(items));
    }
    var arrayPath = window.location.pathname.split("/")[1]
    $(`li > a[href="/${arrayPath}"]`).parent().addClass("active")
  
    $( ".mapHolder iframe" ).load(function() {
      // Handler for .load() called.
        $( ".mapHolder").css("display","block")
    });
    $('[data-toggle="tooltip"]').tooltip()
  
    //storage love
  
    let listItems = (name) => {
      let items = loadStorage(name) ;
      if(items === null) items = [];  // 
      return items;
    }
  
    let addItem = (id, local) => {
      let itemNew = id;
      let items = listItems(local);
      items.push(itemNew);
      // Lưu item vào storgare
      saveStorage(local,items);
      return items
    }
  
    let deleteItem = (id, local) => {
      let items = listItems(local);
      items = items.filter(item => item !== id);
      saveStorage(local, items);
      return items;
    }
  
    formatPrice = (price, unit, discount) =>{
      if(!price || !unit) return
      if(!discount){
        return price.toLocaleString() + ' ' + unit
      } else {
        if(discount.discountValue.unit == 'money'){
          let newPriceMoney = price - discount.discountValue.value
          return `<del>${formatPrice(price, unit)}</del> ${formatPrice(newPriceMoney, unit)}`
        } else{
          let newPricePercent = price - discount.discountValue.value*price/100
          newPricePercent = parseInt(newPricePercent/1000)*1000
          return `<del>${formatPrice(price, unit)}</del> ${formatPrice(newPricePercent, unit)}`
        }
      }
    }
    
    let   showSaleText = (data, unit) =>{
      if(!data) return
      let html = '<span class="hotOfferGreen fwEbold text-uppercase text-white position-absolute d-block ml-8">Sale -'
      if(data.discountValue.unit == 'money'){
        html+= formatPrice(data.discountValue.value, unit)
      } else{
        html+= data.discountValue.value + " %"
      }
      html += '</span>' 
      return html
    }
    
    let  checkTimeInRange = (data) =>{
      if (!data) return
      let time = data.split('-')
      let timeStart = Date.parse(time[0])
      let timeEnd = Date.parse(time[1])
      let timeNow = Date.now()
      let isRight = false
      if (timeNow < timeStart){
        isRight = false
      } else if(timeNow < timeEnd){
        isRight = true
      } 
      return isRight
    }
    
    let  showSaleIcon = (dataShow, money) =>{
      if(!dataShow) return
      let activeData = dataShow.filter(item => item.status === 'active' && checkTimeInRange(item.time)==true)
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
    
    let showListLove = (data, link, unit ) =>{
        console.log(data)
      let html=''
      data.forEach((item,index)=>{
        html+= `
        <tr data-product="product-${item._id}" >
        <td class="product-remove text-center" valign="middle"><a data-product="product-${item._id}" href="javascript:void(0);"><i data-product="product-${item._id}" class="icon icon anm anm-times-l"></i></a></td>
        <td class="product-thumbnail text-center">
            <a href="#"><img src="/uploads/products/${item.images.split(",")[0]}" alt="" title="" /></a>
        </td>
        <td class="product-name"><h4 class="no-margin"><a href="#">${item.name}</a></h4></td>
        <td class="product-price text-center"><span class="amount">${item.price.toLocaleString() + " " + "VND"}</span></td>
        <td class="product-subtotal text-center"><button type="button" class="btn btn-small">Add To Cart</button></td>
        </tr>
        `
    })
      return html
    }
  
  
    $(document).on('click', '.wishlist-btn a.wishlist.add-to-wishlist', function(e) {
        console.log(e.target)
        let dataProduct = $(e.target).attr('data-product').split("-")
        let idCurrent   = dataProduct[1]
        console.log(idCurrent)

      if($(e.target).hasClass('active')){
        console.log("xoa");
        let items = deleteItem(idCurrent, localLOVE)
        $("#LoveCount").text(items.length)
        console.log(items.length)
      } else{
        let items = addItem(idCurrent, localLOVE)
        $("#LoveCount").text(items.length)
      }
      });

    $(document).on('click', 'a[data-product*="product-"]', function(e) {
        console.log($(e.target).attr("data-product"))
        let dataProduct = $(e.target).attr('data-product').split("-")
        let idCurrent   = dataProduct[1]
        let items = deleteItem(idCurrent, localLOVE)
        $("#LoveCount").text(items.length)
        $(`tr[data-product="product-${idCurrent}"]`).remove()

      });

      
      if(pathname == "wishlist"){
        let items= listItems(localLOVE)
        $.ajax({
            type: "POST",
            url: `/${pathname}`,
            data: `data=${JSON.stringify(items)}`, // serializes the form's elements.
            success: async function (response) {
                if(response.success == true){
                    console.log("kasjdhjaskdhjasdjashkdhask")
                  let html =''
                  if(response.data.length == 0){
                    html = `
                        <div class="position-absolute text-center font-weight-bold" style="
                    color: #5ba515;
                    width: 100%; 
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);" role="status">
                        Danh Sách Yêu Thích Trống...
                        </div>
                `
                    $("div.wishlist-table tbody").html(html)
                  } else{
                    let html = await showListLove(response.data)
                    $("div.wishlist-table tbody").html(html)
                  }
                } else{

                }
            }
        });        
      }

      let showCount = () =>{
        let items = listItems(localLOVE)
        $("#LoveCount").text(items.length)
      }
      showCount()
  })
  
  