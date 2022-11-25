const handleAjax = (link,field,id,evt) => {
   let value; let xhtml;
   let parent = $(evt).parent();
   switch (field) {
      case 'categoriesId':
         value = $(evt).val();
         break;
      case 'parentId':
         value = $(evt).val();
         if(id == value) {
            ntf(evt,'error','error')
            return;
         }
         break;
      case 'status':
         value = $(evt).data('value') == 'active' ? 'inactive' : 'active';
         xhtml = `<a href="javascript:void(0)" class="rounded-circle btn btn-sm ${value == 'active' ? 'btn-success' : 'btn-warning'}" onClick="handleAjax('${link}','status','${id}',this)" data-value="${value}"><i class="fas fa-check"></i></a>`;
         break;
         case 'isAdmin':
            value = $(evt).data('value') == 'yes' ? 'no' : 'yes';
            xhtml = `<a href="javascript:void(0)" class="rounded-circle btn btn-sm ${value == 'yes' ? 'btn-success' : 'btn-warning'}" onClick="handleAjax('${link}','isAdmin','${id}',this)" data-value="${value}"><i class="fas fa-check"></i></a>`;
            break;
      case 'ordering':
         value = evt.value;
         if(isNaN(value)) {
            evt.value = evt.value.replace(/[^0-9]/g,'');
            ntf(evt,'Please Insert Number','error')
            return;
         } 
         break;
         case 'quantity':
            value = evt.value;
            if(isNaN(value)) {
               evt.value = evt.value.replace(/[^0-9]/g,'');
               ntf(evt,'Please Insert Number','error')
               return;
            } 
            break;
      case 'link':
         value = evt.value;
         var pattern = new RegExp(
            '^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
         if(!pattern.test(value)) {
            ntf(evt,'Link ko hop le','error')
            return;
         }
         break;
      default:
         break;
   }
   console.log(id,field,value)
   $.ajax({
      method: "post",
      url: link,
      data: { id,field,value},
      dataType: "json"
      }).done(function( data ) {
         if(xhtml) {
            $(parent).html(xhtml);
            evt = $(parent).children();
         }
         ntf(evt);
      });
}
const handleSlug = (link,evt) => {
   let url = link + 'slug';
   let value = evt.value;
   $.ajax({
      method: "post",
      url,
      data: {value},
      dataType: "JSON"
      }).done(function( data ) {
         $("[name='slug']").val(data);
      });
}

$("#sendMail").submit(function(e) {
   $('[data-toggle="tooltip"]').tooltip()
   $("form").submit((e)=>{
     $( "form button[type='submit']" ).addClass('disabled').attr('disabled','')
   })
 
   $('.submitButton').html(`
    <div class="spinner-border text-success" role="status">
        <span class="sr-only">Loading...</span>
    </div> Đang gửi...
    `)
   let urlPath = window.location.pathname.split("/")[1]
   e.preventDefault(); // avoid to execute the actual submit of the form.
   var form = $("#sendMail").serialize();
   $.ajax({
       type: "POST",
       url: `/${urlPath}/`,
       data: form, // serializes the form's elements.
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
               toastr["success"]("Đã gửi thông tin thành công.")
               $("#sendMail input").val("")
               $("#sendMail textarea").val("")
           } else {
               toastr["error"]("Đã có lỗi, vui lòng thử lại!")
           }
           $('.submitButton').html('<input type="submit" class="btn" value="Send Message">')

       }
   });
});
$("#formProfile").submit(function(e) {
   e.preventDefault(); // avoid to execute the actual submit of the form.
   let urlPath = window.location.pathname.split("/")[1]
   e.preventDefault(); // avoid to execute the actual submit of the form.
   var form = $("#formProfile").serialize();
   $.ajax({
       type: "POST",
       url: `/${urlPath}/cap-nhat-thong-tin`,
       data: form, // serializes the form's elements.
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
               toastr["success"]("Cập Nhật Thông Tin Thành Công")
           } else {
               try {
                 response.errors.forEach((item)=>{
                   toastr["error"](item.msg)
                   })
               } catch (error) {
                 toastr["error"]("Có lỗi xảy ra")
               }
           }
           $(e.target).children('.d-flex.justify-content-center.spinner').html(`
           <button type="submit" class="btn  btn-block btn-lg gradient-custom-4 ">Thay Đổi Thông Tin</button>
           `)
       }
   });
 });
 $("#formChangePassword").submit(function(e) {
   e.preventDefault(); // avoid to execute the actual submit of the form.
   let urlPath = window.location.pathname.split("/")[1]
   e.preventDefault(); // avoid to execute the actual submit of the form.
   var form = $("#formChangePassword").serialize();
   $.ajax({
       type: "POST",
       url: `/${urlPath}/doi-mat-khau`,
       data: form, // serializes the form's elements.
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
               toastr["success"]('Đổi Mật Khẩu Thành Công')
           } else {
             toastr["error"](response.errors[0].msg)
           }
           $(e.target).children('.d-flex.justify-content-center.spinner').html(`
           <button type="submit" class="btn btn-success btn-block btn-lg gradient-custom-4 submitButton">Đổi</button>
           `)
       }
   });
 });

 var previousOrderSelect
 // change status order
$(document)
 .on('focus',"select[data-id*='orders-']",function (e) {
   // Store the current value on focus and on change
   let oldStatus = $(e.target).find(":selected").val()
   previousOrderSelect = oldStatus
   console.log(previousOrderSelect)
 })
 .on('change',"select[data-id*='orders-']",(e)=>{
   let elmNumberPrevious = $(`#count-items-${previousOrderSelect} span`)
   let numberPrevious = parseInt(elmNumberPrevious.text()) - 1

   let newStatus = $(e.target).find(":selected").val()
   let id        = $(e.target).attr('data-id').split('-')[1]
   if(newStatus > 2){
       if (confirm("Are you sure change? Note: Status 'Deliveried, Cancel, Return' can't be changed") == false) {
         $(`select[data-id='orders-${id}'] option[value='${previousOrderSelect}']`).prop('selected', true)
         return
       } 
   }
   $.ajax({
     type: "post",
     url: `/adminCCC/order/change-status/`,
     data: `status=${newStatus}&id=${id}`,
     dataType: "json",
     success: function (response) {
      toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "200",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
       if (response.success == true) {
         let data = response.data
         toastr["success"]('Đổi trạng thái thành công')
         if(data.status > 2){
           $(e.target).prop('disabled', true)
         }
         let elmNumberNew = $(`#count-items-${data.status} span`)
         let numberNew = parseInt(elmNumberNew.text()) + 1
         elmNumberNew.text(numberNew)
         elmNumberPrevious.text(numberPrevious)
       } else {
         let msg = response.errors[0].msg
         toastr["error"](msg)
         $(`select[data-id='orders-${id}'] option[value='${previousOrderSelect}']`).prop('selected', true)
       }
     }
   })
   .fail(function() {
     alert( "Have error, Please press F5." );
     $(`select[data-id='orders-${id}'] option[value='${previousOrderSelect}']`).prop('selected', true)
   })
 })
 
