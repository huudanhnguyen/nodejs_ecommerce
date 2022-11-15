$(document).ready(function () {
  const localCART = "LIST_CART";
  const localLOVE = "LIST_LOVE";
  const pathname = window.location.pathname.split("/")[1];
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-left",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

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
    let itemNew
    if (localLOVE == local){
      let checkExitLove = items.filter(item=> item === id)
      if(checkExitLove.length>0){
        return items
      } else{
        itemNew = id;
        items.push(itemNew);
      }
    } else if(localCART == local){
      let checkExitCart = items.filter(item=> item.id===id)
      if(checkExitCart.length>0){
        return items
      } else{
        itemNew = {id: id, quantity: 1}
        items.push(itemNew);
      }
    }
    // Lưu item vào storgare
    saveStorage(local,items);
    return items
  }
  let editItem = (id, local, quantity) => {
    let items = listItems(local);
    let itemEditedIndex
    if(localCART == local){
      itemEditedIndex = items.findIndex((obj => obj.id == id));
    }
    items[itemEditedIndex].quantity = quantity
    saveStorage(local, items);
    return items;
  }

  let deleteItem = (id, local) => {
    let items = listItems(local);
    if (localLOVE == local){
      items = items.filter(item => item !== id);
    } else if(localCART == local){
      items = items.filter(item => item.id !== id);
    }
    saveStorage(local, items);
    return items;
  };

  let showListLove = (data, link, unit) => {
    let html = "";
    data.forEach((item, index) => {
      html += `
        <tr data-product="product-${item._id}" >
        <td class="product-remove text-center" valign="middle"><a data-product="product-${item._id}" href="javascript:void(0);"><i data-product="product-${item._id}" class="icon icon anm anm-times-l"></i></a></td>
        <td class="product-thumbnail text-center">
            <a href="#"><img src="/uploads/products/${item.images.split(",")[0]}" alt="" title="" /></a>
        </td>
        <td class="product-name"><h4 class="no-margin"><a href="#">${item.name}</a></h4></td>
        <td class="product-price text-center"><span class="amount">${item.price.toLocaleString() + " " + "VND"}</span></td>
        <td class="product-subtotal text-center"><a href="javascript:void(0);" class="addtocart" ><button data-product="product-${item._id}" class="btn addtocart"  type="button" tabindex="0">THÊM GIỎ HÀNG</button></a>
        </td>
        </tr>
        `;
    });
    return html;
  };
  let showListCart = (data,quantity) => {
    let getValueQuantity = (quantitybyid) =>{
      if(quantitybyid == undefined) return 
      let data = quantity.find(obj=>{
        return obj.id === quantitybyid
      })
      return data.quantity
    }
    let html = "";
    data.forEach((item, index) => {
      html += `
      <tr class="cart__row border-bottom line1 cart-flex border-top"data-product="product-${item._id}">
      <td class="cart__image-wrapper cart-flex-item">
          <a href="#"><img class="cart__image" src="/uploads/products/${item.images.split(",")[0]}" alt="Elastic Waist Dress - Navy / Small"></a>
      </td>
      <td class="cart__meta small--text-left cart-flex-item">
          <div class="list-view-item__title">
              <a href="#">${item.name}</a>
          </div>
      </td>
      <td class="cart__update-wrapper cart-flex-item text-right">
          <div class="cart__qty text-center">
              <div class="qtyField">
                  <input class="cart__qty-input qty" type="number" href="javascript:void(0); name="updates[]" id="qty" data-product="product-${item._id}" value="${getValueQuantity(item._id)}" pattern="[0-9]*">
              </div>
          </div>
      </td>
      <td class="text-right small--hide cart-price">
          <div><span class="money" data-product="priceProductTotal-${item._id}">${item.price.toLocaleString() + " " + "VND"}</span></div>
      </td>
      <td class="text-center small--hide"><a href="javascript:void(0);" class="btn btn--secondary cart__remove" data-product="product-${item._id}" title="Remove tem"><i class="icon icon anm anm-times-l" data-product="product-${item._id}"></i></a></td>
  </tr>
        `;
    });
    return html;
  };
  $("#qty").change(function(){
    alert($(this).val())
  })

  // thêm
  $(document).on("click", "form a", function (e) {
    let dataProduct = $(e.target).attr("data-product").split("-");
    let idCurrent = dataProduct[1];
    if ($(e.target).hasClass("addtocart")) {

        let items = addItem(idCurrent, localCART);
        $(e.target).addClass("active");
        $("#CartCount").text(items.length);
        toastr["success"]('Thêm Thành Công')
        }
    if ($(e.target).hasClass("addtolove")) {
      if ($(e.target).hasClass("active")) {
        let items = deleteItem(idCurrent, localLOVE);
        $(e.target).text('Yêu Thích')
        $(e.target).removeClass("active");
        $("#LoveCount").text(items.length);
        toastr["warning"]('Xóa Thành Công')
      } else {
        let items = addItem(idCurrent, localLOVE);
        $(e.target).addClass("active");
        $(e.target).text('Bỏ Yêu Thích')
        $("#LoveCount").text(items.length);
        toastr["success"]('Thêm Thành Công')
      }
    }
  });
  // xóa sản phẩm trong yêu thích
  $(document).on('click', 'a[data-product*="product-"]', function(e) {
      // console.log($(e.target).attr("data-product"))
      let dataProduct = $(e.target).attr('data-product').split("-")
      let idCurrent   = dataProduct[1]
      let items = deleteItem(idCurrent, localLOVE)
      $(e.target).removeClass("active")
      $("#LoveCount").text(items.length)
      $(`tr[data-product="product-${idCurrent}"]`).remove()


    });
      // xóa sản phẩm trong giỏ hàng
  $(document).on('click', 'a[data-product*="product-"]', function(e) {
    // console.log($(e.target).attr("data-product"))
    let dataProduct = $(e.target).attr('data-product').split("-")
    let idCurrent   = dataProduct[1]
    let items = deleteItem(idCurrent, localCART)
    $("#CartCount").text(items.length)
    $(`td[data-product="product-${idCurrent}"]`).remove()
    cartTotal();
    toastr["warning"]('Xóa Thành Công')


  });

  let loadListLove = () =>{
    let items = listItems(localLOVE)
    $("#LoveCount").text(items.length)
    $("a .addtolove button")
    items.forEach(item=>{
      $(`a.addtolove button[data-product*="product-${item}"]`).addClass("active").text("Bỏ Yêu Thích")
    })
  }
  loadListLove()
  let loadListCart = () =>{
    let items = listItems(localCART)
    $("#CartCount").text(items.length)
    $("a .addtocart button")
    items.forEach(item=>{
      $(`a.addtocart button[data-product*="product-${item}"]`).addClass("active")
    })
  }
  loadListCart()

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
          loadListLove()
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
             html = await showListCart(response.data,items);
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

  let cartTotal=()=>{
    let cartItem=document.querySelectorAll("tbody tr")
    let totalPrice=0;
    for (let i = 0; i < cartItem.length; i++) {
      let inputValue=cartItem[i].querySelector("input").value
      let productPrice=cartItem[i].querySelector("span").innerHTML
      total=inputValue*parseInt(productPrice)*1000
      totalPrice=totalPrice+total
    }
    let totalPriceCart=document.querySelector(".totalMoney span")
    totalPriceCart.innerHTML=totalPrice.toLocaleString('de-DE')
    inputChange();
  }
  let inputChange=()=>{
    let cartItem=document.querySelectorAll("tbody tr")
    for (let i = 0; i < cartItem.length; i++) {
      let inputValue=cartItem[i].querySelector("input")
      inputValue.addEventListener("change",function(){
        cartTotal();
      })
    }

  }

});
