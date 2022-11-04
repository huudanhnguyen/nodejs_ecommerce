var express = require('express');
var router = express.Router();
const FrontEndHelpers = require(__path_helpers + 'frontend');
const { body, validationResult } = require('express-validator');



const {col_products,col_categories,col_menu,col_sliders,col_settings} = require(__path_configs + 'database');
const productsModel 		= require(__path_schemas + col_products);
const settingsModel 		= require(__path_schemas + col_settings);
const ContactModel 		= require(__path_models + 'contact');
const sliderModel 		= require(__path_schemas + col_sliders);
const categoryModel 		= require(__path_schemas + col_categories);
const Model 		= require(__path_models + 'products');
const menuModel 		= require(__path_schemas + col_menu);
const folderView	 = __path_view_ecommerce + 'pages/contact/';
const layout	     = __path_view_ecommerce+ 'frontend';
/* GET home page. */
router.get('/',async (req, res, next) => {
  // let itemsSpecial 	= [];
  // await Model.listItemsFrontend(null, {task: 'items-special'} ).then( (items) => { itemsSpecial = items;
  //   items.map(async i=>{
  //     let{name}=await categoryModel.findById((i.categoriesId))
  //       i.categoryName=name;
  //       return i
  //     })
  //     items= itemsSpecial;
  // });
  // await Model.listItemsFrontend(null, {task: 'items-ecommerce'} ).then( (items) => { itemsEcommerce = items;
  //   items.map(async i=>{
  //     let{name}=await categoryModel.findById((i.categoriesId))
  //       i.categoryName=name;
  //       return i
  //     })
  //     itemsEcommerce=items; 
  // });
  let item = await settingsModel.findOne({});

	const {copyright, content, logoFooter,phoneFooter,email,address,linkfacebook,linkyoutube} = JSON.parse(item.footer);
	const {logoHeader,phoneHeader,notification} = JSON.parse(item.header);
	
	item.copyright = copyright;
	item.content = content;
	item.address = address;
	item.phoneFooter = phoneFooter;
	item.email = email;
	item.logoFooter = logoFooter;
	item.linkfacebook=linkfacebook;
	item.linkyoutube=linkyoutube;

	item.phoneHeader = phoneHeader;
	item.notification = notification;
	item.logoHeader = logoHeader;

  const listProducts = await productsModel.find({}).limit(4);
  const listMenu = await menuModel.find({status:'active'}).sort({ordering: 'desc'});
  const listSliders = await sliderModel.find({status:'active'});
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
  res.render(`${folderView}index`, { 
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    // itemsSpecial,
    // itemsEcommerce,
    listCategory,
    slider:false
  });
});
router.post('/',async (req,res,next)=>{
  try {
    console.log(req.body);
    let sendMail= await ContactModel.mainMail(req.body);
    let saveItem= await ContactModel.addOne(req.body);
    res.send({
      success:true
    })
    
  } catch (error) {
    console.log(error);
  }
});
router.post('/dang-ky-mail', 
body('email')
    .isEmail(),
async function(req, res, next) {
    try {
        let errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.send({success: false})
        } else{
            let item = req.body
            item.status = 'active'
            item.ordering = '1'
            let sendMail = await FrontEndHelpers.sendMailLetter(item)
            let saveData = await FrontEndHelpers.saveNewsletter(item)
            res.send({success: true})
        }
    } catch (error) {
        console.log(error)
        res.send({success: false})
    }
});

module.exports = router;
