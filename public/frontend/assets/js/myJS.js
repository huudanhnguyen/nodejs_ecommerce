let getListProductOrder = () =>{
  let list = []
  console.log('asdsa');
  $("tbody#CartList .cart__row.border-bottom").each((index,item)=>{
    console.log(item);
    let obj  = {}
    obj.id = $(item).attr('data-product').split('-')[1]
    obj.quantity = $(`div.qtyField input[data-product="product-${obj.id}"]`).val()
    list.push(obj)
  })
  return list
}
function checkOut() {
  let name = $('input[name="name"]').val();
  let address = $('input[name="address"]').val();
  let phoneNumber = $('input[name="phoneNumber"]').val();
  let couponCode = $('input[name="codeCouponSuccess"]').val();
  let priceProduct = $("span.priceCheckOut").text().replaceAll(/[^0-9]/g, "");
  let totalCheckout = $("span.totalCheckout").text().replaceAll(/[^0-9]/g, "")
  let costShip = $("span.costShip").text().replaceAll(/[^0-9]/g, "");
  let productOrder = JSON.stringify(getListProductOrder())
  let notes = $('textarea[name="notes"]').val();

console.log(productOrder);
  let data = {
    name: name,
    address: address,
    phoneNumber: phoneNumber,
    costShip: costShip,
    couponCode: couponCode,
    priceProduct: priceProduct,
    totalMoney: totalCheckout,
    productOrder: productOrder,
    notes: notes,
  };
  $.ajax({
    type: "POST",
    url: `/cart/dat-hang`,
    data: data, // serializes the form's elements.
    success: function (response) {
      toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-center",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }
        if(response.success == true){
            let html = `
            <div class="orderSuccess">
            <div class="row">
               <div class="col-md-6 mx-auto mt-5">
                  <div class="payment">
                     <div class="payment_header">
                        <div class="check"><i class="fa fa-check" aria-hidden="true"></i></div>
                     </div>
                     <div class="content">
                        <h1>Đặt Hàng Thành Công !</h1>
                        <p>Cảm ơn bạn đã đặt hàng của chúng tôi. Mã kiểm tra đơn hàng của bạn là: 
                        <span class="trackingCode">${response.trackingCode}</span>
                        </p>
                        <a href="/">Trờ Về Trang Chủ</a>
                     </div>
                  </div>
               </div>
            </div>
         </div>
            `
            $("#page-content").html(html)
            $('html, body').animate({scrollTop: '0px'}, 0);
            localStorage.setItem('LIST_CART', JSON.stringify([]));
            $('#CartCount').text('0')
        } else {
          try {
            response.errors.forEach((item)=>{
              toastr["error"](item.msg)
              })
          } catch (error) {
            toastr["error"]("Có lỗi xảy ra vui lòng F5 trang")
          }
          $("div.cartHolder a.orderComplete").html('Mua Hàng').removeClass('disabled')
          $(".submitCodeCoupon").removeClass('d-none')
        }
    }
});
}

$(document).ready(function () {
  const localCART = "LIST_CART";
  const localLOVE = "LIST_LOVE";
  const pathname = window.location.pathname.split("/")[1];

  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-left",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "2000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  let loadStorage = (local) => {
    return JSON.parse(localStorage.getItem(local));
  };

  let saveStorage = (local, items) => {
    localStorage.setItem(local, JSON.stringify(items));
  };
  var arrayPath = window.location.pathname.split("/")[1];
  $(`a[href="/${arrayPath}"]`).parent().addClass("active");

  //storage love

  let listItems = (name) => {
    let items = loadStorage(name);
    if (items === null) items = []; //
    return items;
  };

  let addItem = (id, local) => {
    let items = listItems(local);
    let itemNew;
    if (localLOVE == local) {
      let checkExitLove = items.filter((item) => item === id);
      if (checkExitLove.length > 0) {
        return items;
      } else {
        itemNew = id;
        items.push(itemNew);
      }
    } else if (localCART == local) {
      let foundIndex = items.findIndex((x) => x.id == id);
      if (foundIndex >= 0) {
        items[foundIndex].quantity++;
      } else {
        itemNew = { id: id, quantity: 1 };
        items.push(itemNew);
      }
    }
    // Lưu item vào storgare
    saveStorage(local, items);
    return items;
  };
  let editItem = (id, local, quantity) => {
    let items = listItems(local);
    let itemEditedIndex;
    if (localCART == local) {
      itemEditedIndex = items.findIndex((obj) => obj.id == id);
    }
    items[itemEditedIndex].quantity = quantity;
    saveStorage(local, items);
    return items;
  };

  let deleteItem = (id, local) => {
    let items = listItems(local);
    if (localLOVE == local) {
      items = items.filter((item) => item !== id);
    } else if (localCART == local) {
      items = items.filter((item) => item.id !== id);
    }
    saveStorage(local, items);
    return items;
  };

  let showListLove = (data, link, unit) => {
    let html = "";
    data.forEach((item, index) => {
      html += `
        <tr data-product="product-${item._id}" >
        <td class="product-remove text-center" valign="middle"><a data-product="product-${
          item._id
        }" href="javascript:void(0);"><i data-product="product-${
        item._id
      }" class="icon icon anm anm-times-l"></i></a></td>
        <td class="product-thumbnail text-center">
            <a href="san-pham/${item._id}"><img src="/uploads/products/${
        item.images.split(",")[0]
      }" alt="" title="" /></a>
        </td>
        <td class="product-name"><h4 class="no-margin"><a href="san-pham/${
          item._id
        }">${item.name}</a></h4></td>
        <td class="product-price text-center"><span class="amount">${
          item.price.toLocaleString() + " " + "VND"
        }</span></td>
        <td class="product-subtotal text-center"><a href="javascript:void(0);" class="addtocart" ><button data-product="product-${
          item._id
        }" class="btn addtocart"  type="button" tabindex="0">THÊM GIỎ HÀNG</button></a>
        </td>
        </tr>
        `;
    });
    return html;
  };
  let showListCart = (data, quantity) => {
    let getValueQuantity = (quantitybyid) => {
      if (quantitybyid == undefined) return;
      let data = quantity.find((obj) => {
        return obj.id === quantitybyid;
      });
      return data.quantity;
    };
    let html = "";
    data.forEach((item, index) => {
      html += `
      <tr class="cart__row border-bottom line1 cart-flex border-top"data-product="product-${
        item._id
      }">
      <td class="cart__image-wrapper cart-flex-item">
          <a href="san-pham/${
            item._id
          }"><img class="cart__image" src="/uploads/products/${
        item.images.split(",")[0]
      }" alt="Elastic Waist Dress - Navy / Small"></a>
      </td>
      <td class="cart__meta small--text-left cart-flex-item">
          <div class="list-view-item__title">
              <a href="san-pham/${item._id}">${item.name}</a>
          </div>
      </td>
      <td class="cart__update-wrapper cart-flex-item text-right">
          <div class="cart__qty text-center">
              <div class="qtyField">
                  <input type="number" href="javascript:void(0); id="qty" data-product="product-${
                    item._id
                  }" value="${getValueQuantity(item._id)}" min="1" max="10"">
              </div>
          </div>
      </td>
      <td class="text-right small--hide cart-price">
          <div><span class="money" data-product="priceProductTotal-${
            item._id
          }">${item.price.toLocaleString() + " " + "VND"}</span></div>
      </td>
      <td class="text-center small--hide"><a href="javascript:void(0);" class="btn btn--secondary cart__remove" data-product="product-${
        item._id
      }" title="Remove tem"><i class="icon icon anm anm-times-l" data-product="product-${
        item._id
      }"></i></a></td>
  </tr>
        `;
    });
    return html;
  };
  $("#qty").change(function () {
    alert($(this).val());
  });

  // thêm
  $(document).on("click", "form a", function (e) {
    let dataProduct = $(e.target).attr("data-product").split("-");
    let idCurrent = dataProduct[1];
    if ($(e.target).hasClass("addtocart")) {
      let items = addItem(idCurrent, localCART);
      $(e.target).addClass("active");
      $("#CartCount").text(items.length);
      toastr["success"]("Thêm Thành Công");
    }
    if ($(e.target).hasClass("addtolove")) {
      if ($(e.target).hasClass("active")) {
        let items = deleteItem(idCurrent, localLOVE);
        $(e.target).text("Yêu Thích");
        $(e.target).removeClass("active");
        $("#LoveCount").text(items.length);
        toastr["warning"]("Xóa Thành Công");
      } else {
        let items = addItem(idCurrent, localLOVE);
        $(e.target).addClass("active");
        $(e.target).text("Bỏ Yêu Thích");
        $("#LoveCount").text(items.length);
        toastr["success"]("Thêm Thành Công");
      }
    }
  });
  // xóa sản phẩm trong yêu thích
  $(document).on("click", '#wishList a[data-product*="product-"]', function (e) {
    // console.log($(e.target).attr("data-product"))
    let dataProduct = $(e.target).attr("data-product").split("-");
    let idCurrent = dataProduct[1];
    let items = deleteItem(idCurrent, localLOVE);
    $(e.target).removeClass("active");
    $("#LoveCount").text(items.length);
    $(`tr[data-product="product-${idCurrent}"]`).remove();
  });
  // xóa sản phẩm trong giỏ hàng
  $(document).on("click", '#CartList a[data-product*="product-"]', function (e) {
    // console.log($(e.target).attr("data-product"))
    let dataProduct = $(e.target).attr("data-product").split("-");
    let idCurrent = dataProduct[1];
    let items = deleteItem(idCurrent, localCART);
    $("#CartCount").text(items.length);
    $(`tr[data-product="product-${idCurrent}"]`).remove();
    cartTotal();
    toastr["warning"]("Xóa Thành Công");
    removeCoupon();
  });

  let loadListLove = () => {
    let items = listItems(localLOVE);
    $("#LoveCount").text(items.length);
    $("a .addtolove button");
    items.forEach((item) => {
      $(`a.addtolove button[data-product*="product-${item}"]`)
        .addClass("active")
        .text("Bỏ Yêu Thích");
    });
  };
  loadListLove();
  var loadListCart = () => {
    let items = listItems(localCART);
    $("#CartCount").text(items.length);
    $("a .addtocart button");
    items.forEach((item) => {
      $(`a.addtocart button[data-product*="product-${item}"]`).addClass(
        "active"
      );
    });
  };
  loadListCart();

  if (pathname == "wishlist") {
    let items = listItems(localLOVE);
    $.ajax({
      type: "POST",
      url: `/${pathname}`,
      data: `data=${JSON.stringify(items)}`, // serializes the form's elements.
      success: async function (response) {
        if (response.success == true) {
          let html = "";
          if (response.data.length == 0) {
            html = ``;
            $("div.wishlist-table tbody").html(html);
          } else {
            html = await showListLove(response.data);
            $("tbody#wishList").html(html);
          }
          loadListLove();
        }
      },
    });
  }
  if (pathname == "cart") {
    let items = listItems(localCART);
    $.ajax({
      type: "POST",
      url: `/${pathname}`,
      data: `data=${JSON.stringify(items)}`, // serializes the form's elements.
      success: async function (response) {
        if (response.success == true) {
          let html = "";
          if (response.data.length == 0) {
            html = ``;
            $("div.tbody#CartList").html(html);
          } else {
            html = await showListCart(response.data, items);
            $("tbody#CartList").html(html);
          }
        }
        cartTotal();
      },
    });
  }
  //show số luong yêu thích
  let showLoveCount = () => {
    let items = listItems(localLOVE);
    $("#LoveCount").text(items.length);
  };
  showLoveCount();
  //show số luong giỏ hàng

  let showCartCount = () => {
    let items = listItems(localCART);

    $("#CartCount").text(items.length);
  };
  showCartCount();

  let cartTotal = () => {
    let cartItem = document.querySelectorAll("tbody tr");
    let totalPrice = 0;
    for (let i = 0; i < cartItem.length; i++) {
      let inputValue = cartItem[i].querySelector("input").value;
      let productPrice = cartItem[i].querySelector("span").innerHTML;
      total = inputValue * parseInt(productPrice) * 1000;
      totalPrice = totalPrice + total;
    }
    let totalPriceCart = document.querySelector(".totalMoney span");
    totalPriceCart.innerHTML = totalPrice.toLocaleString("de-DE");
    showSumPrice();
    inputChange();
  };
  let inputChange = () => {
    let cartItem = document.querySelectorAll("tbody tr");
    for (let i = 0; i < cartItem.length; i++) {cartTotal
      let inputValue = cartItem[i].querySelector("input");
      inputValue.addEventListener("change", function () {
        cartTotal();
        removeCoupon();
      });
    }
  };
  let showSumPrice = () =>{
    let price = parseInt($("span.priceCheckOut").text().replaceAll(/[^0-9]/g, ""))
    let ship = parseInt($("span.costShip").text().replaceAll(/[^0-9]/g, ""))
    let coupon=parseInt($("strong.couponValue").text().replaceAll(/[^0-9]/g, ""))
    let total = 0
    if(coupon > 0) {
      total = price + 25000 - coupon
    } else {
      total = price + 25000
    }
    $("span.totalCheckout").text(total.toLocaleString() +" VND")
  }
  let removeCoupon = () =>{
    $("div.couponSuccess").html('')
    $("div.priceCoupon").remove()
  }
  $( "input[name='couponCode']" ).keyup(function(e) {
    removeCoupon();
    console.log("asdsa");
    let datatotalPrice = $("span.totalMoney span:nth-child(1)").text().replace(/[^0-9]/g, "")
    let totalPrice     =  parseInt(datatotalPrice)
    let couponCode     = $(e.target).val()
      if(totalPrice > 0 && couponCode.length > 0){
          $("input.submitCodeCoupon").prop("disabled", false)
      }
      $(e.target).val(couponCode.toUpperCase())
  });
  submitCoupon = () => {
    let urlPath = window.location.pathname.split("/")[1]
    let dataCode =  $( "input[name='couponCode']" )
    dataCode.prop("disabled", true)
    let spinner = `
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
  </div>
    `
    let code     = dataCode.val().toUpperCase()
    loadListCart();
    let datatotalPrice = $("span.totalMoney span:nth-child(1)").text().replace(/[^0-9]/g, "")
    let totalPrice     =  parseInt(datatotalPrice)
    $.ajax({
      type: "POST",
      url: `/${urlPath}/ma-giam-gia`,
      data: `totalPrice=${totalPrice}&couponCode=${code}`, // serializes the form's elements.
      success: function (response) {
          toastr.options = {
              "closeButton": false,
              "debug": false,
              "newestOnTop": false,
              "progressBar": false,
              "positionClass": "toast-top-center",
              "preventDuplicates": false,
              "onclick": null,
              "showDuration": "300",
              "hideDuration": "1000",
              "timeOut": "5000",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            }
          console.log(response);
          if(response.success == true){
            let data = response.data 
            let html=`
            <div class="alert alert-success align-bottom mt-2 mb-2 text-center" role="alert" style="width: 340px;">
              Áp Dụng Thành Công Mã
               ${data.name}
            </div>
            <input type="hidden" name="codeCouponSuccess" value="${data.name}">
            `
            $(".couponSuccess").append(html)
            let priceAfterCoupon = totalPrice - data.values
            let xhtml = `
            <div class="d-flex justify-content-between priceCoupon">
                <strong class="txt fwEbold text-uppercase mb-1">Số Tiền Được Giảm</strong>
                <strong class="price fwEbold text-uppercase mb-1 couponValue">-${data.values.toLocaleString() + " VND"}</strong>
            </div>
            `
            $("span.cart__subtotal-title:nth-child(4)").before(xhtml)
          } else {
            let html=`
            <div class="alert alert-danger align-bottom mt-2 mb-2 text-center" role="alert" style="width: 340px;">
              Mã Giảm Giá Không Hợp Lệ
            </div>`
            $("fieldset.couponCode > div.mt-holder").append(html)
          }
          dataCode.prop("disabled", false)
          cartTotal()
      }
  });
    
  }
  const moneyVND  = (number)=>{
    return number.toLocaleString() +" VND"
  }

  let showTrackingOrder = (data)=>{
    let showListProduct=(string)=>{
      if (!string) {
        return
      }
      let html=''
      let arr=JSON.parse(string)
      arr.forEach(element => {
        html+=`
        <li class="col-md-4">
                 <figure class="itemside mb-3">
                     <div class="aside"><img src="https://i.imgur.com/iDwDQ4o.png" class="img-sm border"></div>
                     <figcaption class="info align-self-center">
                         <p class="title">${element.name}</p> <span class="text-muted">${moneyVND(element.price)} x ${element.quantity}
                         </span>

                     </figcaption>
                 </figure>
             </li>
        `
      });
      return html;
    }
    let coupon = (data.couponValue)
    ? `
    <div class="row">
      <div class="col-9">
          <span id="name">Giảm Giá</span>
      </div>
      <div class="col-3">
          <span id="price">-${moneyVND(data.couponValue)}</span>
      </div>
    </div>
    `
    :''
     return `
     <article class="card containerTracking">
     <!-- <header class="card-header"> My Orders / Tracking </header> -->
     <div class="card-body">
         <h6>Order ID: ${data.trackingCode}</h6>
         <div class="track">
             <div class="step active"> <span class="icon"> <i class="fa fa-check"></i> </span> <span
                     class="text">Đơn Hàng Đã Xác Nhận</span> </div>
             <div class="step active"> <span class="icon"> <i class="fa fa-user"></i> </span> <span class="text">
                     Đã Lấy Hàng</span> </div>
             <div class="step"> <span class="icon"> <i class="fa fa-truck"></i> </span> <span class="text">
                     Đang Vận Chuyển </span> </div>
             <div class="step"> <span class="icon"> <i class="fa fa-box"></i> </span> <span class="text">
                     Chuẩn Bị Nhận Hàng</span> </div>
         </div>
         <hr>
         <ul class="row">
             
             ${showListProduct(data.productList)}
         </ul>
         <hr>
         <a href="/" class="btn btn-warning" data-abc="true"> <i class="fa fa-chevron-left"></i> Về Trang Chủ</a>
     </div>
 </article>
     `
  }
  let showStatusTracking = (status) =>{
    console.log(status);
    $("div.track .step").each((index,item)=>{
        if (index > status) return
        $(item).addClass('active')
    })
  }
  
  $("#formFindOrder").submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $('article.containerTracking').remove()
    let codeTracking = $("input[name='codeOrder']").val()
    $.ajax({
      type: "get",
      url: `/theo-doi-don-hang/`,
      data: `trackingCode=${codeTracking}`, // serializes the form's elements.
      success: async function (response) {
          if(response.success == true && response.data != null){
              console.log(response.data)
              let html = showTrackingOrder(response.data)
              $('div.trackingForm').after(html)
              showStatusTracking(response.data.status)
          } else{
             toastr["error"]('asd')
          }
          $(e.target).children('.d-flex.justify-content-center.spinner').html(`<button type="submit" class="btn btn-success btn-block btn-lg gradient-custom-4 ">Tra Cứu</button>`)
      }
  });
  });
});

;
