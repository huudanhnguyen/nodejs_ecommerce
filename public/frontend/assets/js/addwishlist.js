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
        <td class="product-price text-center"><span class="amount">${item.price.toLocaleString() + " " + "₫"}</span></td>
        <td class="product-subtotal text-center"><button type="button" class="btn btn-small">Thêm Giỏ Hàng</button></td>
        </tr>
        `
    })
      return html
    }
  
  // thêm-xóa yêu thích
    $(document).on('click', '.wishlist-btn a.wishlist.add-to-wishlist', function(e) {
        console.log(e.target)
        let dataProduct = $(e.target).attr('data-product').split("-")
        let idCurrent   = dataProduct[1]
        console.log(idCurrent)

      if($(e.target).hasClass('active')){
        let items = deleteItem(idCurrent, localLOVE)
        $(e.target).removeClass("active")
        $("#LoveCount").text(items.length)
        console.log(items.length)
      } else{
        let items = addItem(idCurrent, localLOVE)
        $(e.target).addClass("active")
        $("#LoveCount").text(items.length)
      }
      });
// xóa sản phẩm trong yêu thích
    $(document).on('click', 'a[data-product*="product-"]', function(e) {
        console.log($(e.target).attr("data-product"))
        let dataProduct = $(e.target).attr('data-product').split("-")
        let idCurrent   = dataProduct[1]
        let items = deleteItem(idCurrent, localLOVE)
        $(e.target).removeClass("active")
        $("#LoveCount").text(items.length)
        $(`tr[data-product="product-${idCurrent}"]`).remove()

      });

      // let loadListLove = () =>{
      //   let items = listItems(localLOVE)
      //   $("#LoveCount").text(items.length)
      //   items.forEach(item=>{
      //     $(`tr[data-product="product-${items}"]`)
      //   })
      // }
    
      // loadListLove()

      
      if(pathname == "wishlist"){
        let items= listItems(localLOVE)
        $.ajax({
            type: "POST",
            url: `/${pathname}`,
            data: `data=${JSON.stringify(items)}`, // serializes the form's elements.
            success: async function (response) {
                if(response.success == true){
                  let html =''
                  if(response.data.length == 0){
                    html =``
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
//show số luongj yêu thích
      let showCount = () =>{
        let items = listItems(localLOVE)
        $("#LoveCount").text(items.length)
      }
      showCount()
  })
  
  