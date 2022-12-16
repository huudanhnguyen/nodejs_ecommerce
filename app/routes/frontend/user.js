var express = require("express");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const {
  col_products,
  col_categories,
  col_menu,
  col_sliders,
  col_settings,
} = require(__path_configs + "database");
const FrontEndHelpers = require(__path_helpers + 'frontend');

const productsModel = require(__path_schemas + col_products);
const settingsModel = require(__path_schemas + col_settings);
const sliderModel = require(__path_schemas + col_sliders);
const categoryModel = require(__path_schemas + col_categories);
const Model = require(__path_models + "products");
const menuModel = require(__path_schemas + col_menu);
const folderView = __path_view_ecommerce + "pages/user/";
const layout = __path_view_ecommerce + "frontend";
//Profile
router.get("/profile", isLoggedIn, async (req, res, next) => {
  let item = await settingsModel.findOne({});

  const {
    copyright,
    content,
    logoFooter,
    phoneFooter,
    email,
    address,
    linkfacebook,
    linkyoutube,
  } = JSON.parse(item.footer);
  const { logoHeader, phoneHeader, notification } = JSON.parse(item.header);

  item.copyright = copyright;
  item.content = content;
  item.address = address;
  item.phoneFooter = phoneFooter;
  item.email = email;
  item.logoFooter = logoFooter;
  item.linkfacebook = linkfacebook;
  item.linkyoutube = linkyoutube;
  item.phoneHeader = phoneHeader;
  item.notification = notification;
  item.logoHeader = logoHeader;

  const listProducts = await productsModel.find({}).limit(4);
  const listMenu = await menuModel
    .find({ status: "active" })
    .sort({ ordering: "desc" });
  const listSliders = await sliderModel.find({ status: "active" });
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
  res.render(`${folderView}profile`, {
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    listCategory,
    slider: false,
  });
});
router.post('/cap-nhat-thong-tin',
        body('username')
                .isLength({min: 3, max: 30})
                .withMessage('Độ Dài Tên Từ 3 Đến 30'),
        body('phone')
                .isMobilePhone()
                .withMessage('Số Điện Thoại Sai'),
        async function(req, res, next) {
            try {
                let errors = validationResult(req)
                if(req.isAuthenticated()) {
                    if(!errors.isEmpty()){
                        res.send({success: false, errors: errors.errors})
                        return
                    } else{
                        let email = req.user.email
                        req.body.email = email
                        let updateUser = await FrontEndHelpers.updateInfoUser(req.body)
                        res.send({success: true})
                    }
                }else{
                    res.send({success: false, errors:[{
                        msg:"Có lỗi xảy ra vui lòng F5 trang"
                    }]})
                }
            } catch (error) {
                res.send({success: false,errors:[{
                    msg:"Có lỗi xảy ra vui lòng F5 trang"
                }]})
            }
            
});
//Đổi Mật Khẩu
router.post('/doi-mat-khau',
    body('password')
        .custom((value, { req })=>{
            let {confirmpassword, password} = req.body

            if (!password) {
                return Promise.reject('Vui Lòng Nhập Mật Khẩu')
            }
            if((confirmpassword.length<5 || confirmpassword.length>20)|| (password.length<5 || password.length>20)
            ){
                return Promise.reject('Độ Dài Phải Từ 5 đến 20')
            }
            if(password != confirmpassword){
                return Promise.reject('Mật Khẩu Không Trùng')
            }
            return Promise.resolve()
        }),
        async function(req, res, next) {
            try {
                let errors = validationResult(req)
                if(req.isAuthenticated()) {
                    if(!errors.isEmpty()){
                        res.send({success: false, errors: errors.errors})
                        return
                    } else{
                        let email = req.user.email
                        req.body.email = email
                        let updateUser = await FrontEndHelpers.updatePasswordUser(req.body)
                        res.send(updateUser)
                    }
                }else{
                    res.send({success: false, errors:[{
                        msg:"Có lỗi xảy ra vui lòng F5 trang"
                    }]})
                }
            } catch (error) {
                console.log(error)
                res.send({success: false,errors:[{
                    msg:"Có lỗi xảy ra vui lòng F5 trang"
                }]})
            }
            
});

//logout
router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
router.get("/", notLoggedIn, function (req, res, next) {
  next();
});
//Login
router.get("/signin", async (req, res, next) => {
  let error = []
  if(req.flash().hasOwnProperty('error')){
    error.push({
        msg: req.flash().error,
        param: 'emailexits'
    })
}
  let item = await settingsModel.findOne({});
  const {
    copyright,
    content,
    logoFooter,
    phoneFooter,
    email,
    address,
    linkfacebook,
    linkyoutube,
  } = JSON.parse(item.footer);
  const { logoHeader, phoneHeader, notification } = JSON.parse(item.header);

  item.copyright = copyright;
  item.content = content;
  item.address = address;
  item.phoneFooter = phoneFooter;
  item.email = email;
  item.logoFooter = logoFooter;
  item.linkfacebook = linkfacebook;
  item.linkyoutube = linkyoutube;

  item.phoneHeader = phoneHeader;
  item.notification = notification;
  item.logoHeader = logoHeader;

  const listProducts = await productsModel.find({}).limit(4);
  const listMenu = await menuModel
    .find({ status: "active" })
    .sort({ ordering: "desc" });
  const listSliders = await sliderModel.find({ status: "active" });
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
  res.render(`${folderView}signin`, {
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    listCategory,
    slider: false,
    error,
  });
});
router.post(
  "/signin",
  body("email").isEmail().normalizeEmail().withMessage("Định Dạng Email Sai"),
  body("password").custom((value, { req }) => {
    let {password } = req.body;
    if (!password) {
      return Promise.reject("Chưa Nhập Mật Khẩu");
    }
    if (
      password.length < 6 ||
      password.length > 20
    ) {
      return Promise.reject("Mật Khẩu Không Hợp Lệ");
    }
    return Promise.resolve();
  }),
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) res.redirect("/");
      req.body = JSON.parse(JSON.stringify(req.body));
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        let item = await settingsModel.findOne({});
        const {
          copyright,
          content,
          logoFooter,
          phoneFooter,
          email,
          address,
          linkfacebook,
          linkyoutube,
        } = JSON.parse(item.footer);
        const { logoHeader, phoneHeader, notification } = JSON.parse(item.header);
      
        item.copyright = copyright;
        item.content = content;
        item.address = address;
        item.phoneFooter = phoneFooter;
        item.email = email;
        item.logoFooter = logoFooter;
        item.linkfacebook = linkfacebook;
        item.linkyoutube = linkyoutube;
      
        item.phoneHeader = phoneHeader;
        item.notification = notification;
        item.logoHeader = logoHeader;
        const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
        const listMenu = await menuModel
        .find({ status: "active" })
        .sort({ ordering: "desc" });
        const listProducts = await productsModel.find({}).limit(4);

      
        res.render(`${folderView}signin`, {
          layout,
          item,
          listCategory,
          listMenu,
          listProducts,
          slider:false,
          error: errors.errors,
        });
        return;
      } else {
        passport.authenticate("local.signin", {
          successRedirect: "/user/profile",
          failureRedirect: "/user/signin",
          failureFlash: true,
        })(req, res, next);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
);
//Register
router.get("/signup", async (req, res, next) => {
  let error = []
  if(req.flash().hasOwnProperty('error')){
    error.push({
        msg: req.flash().error,
        param: 'emailexits'
    })
}
  let item = await settingsModel.findOne({});
  const {
    copyright,
    content,
    logoFooter,
    phoneFooter,
    email,
    address,
    linkfacebook,
    linkyoutube,
  } = JSON.parse(item.footer);
  const { logoHeader, phoneHeader, notification } = JSON.parse(item.header);

  item.copyright = copyright;
  item.content = content;
  item.address = address;
  item.phoneFooter = phoneFooter;
  item.email = email;
  item.logoFooter = logoFooter;
  item.linkfacebook = linkfacebook;
  item.linkyoutube = linkyoutube;

  item.phoneHeader = phoneHeader;
  item.notification = notification;
  item.logoHeader = logoHeader;

  const listProducts = await productsModel.find({}).limit(4);
  const listMenu = await menuModel
    .find({ status: "active" })
    .sort({ ordering: "desc" });
  const listSliders = await sliderModel.find({ status: "active" });
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
  res.render(`${folderView}signup`, {
    layout,
    listProducts,
    listSliders,
    listMenu,
    item,
    listCategory,
    slider: false,
    error
  });
});

router.post(
  "/signup",
  body("email").isEmail().normalizeEmail().withMessage("Định Dạng Email Sai"),
  body("username").isLength({ min: 3, max: 30 }).withMessage("Chiều Dài Tên Phải Từ 3 Đến 30"),
  body("password").custom((value, { req }) => {
    let { confirmpassword, password } = req.body;

    if (!confirmpassword || !password) {
      return Promise.reject("Chưa Nhập Mật Khẩu");
    }
    if (
      confirmpassword.length < 6 ||
      confirmpassword.length > 20 ||
      password.length < 6 ||
      password.length > 20
    ) {
      return Promise.reject("Mật Khẩu Không Hợp Lệ");
    }
    if (password != confirmpassword) {
      return Promise.reject("Mật Khẩu Không Khớp");
    }
    return Promise.resolve();
  }),
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) res.redirect("/");
      req.body = JSON.parse(JSON.stringify(req.body));
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        let item = await settingsModel.findOne({});
        const {
          copyright,
          content,
          logoFooter,
          phoneFooter,
          email,
          address,
          linkfacebook,
          linkyoutube,
        } = JSON.parse(item.footer);
        const { logoHeader, phoneHeader, notification } = JSON.parse(item.header);
      
        item.copyright = copyright;
        item.content = content;
        item.address = address;
        item.phoneFooter = phoneFooter;
        item.email = email;
        item.logoFooter = logoFooter;
        item.linkfacebook = linkfacebook;
        item.linkyoutube = linkyoutube;
      
        item.phoneHeader = phoneHeader;
        item.notification = notification;
        item.logoHeader = logoHeader;
        const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });
        const listMenu = await menuModel
        .find({ status: "active" })
        .sort({ ordering: "desc" });
        const listProducts = await productsModel.find({}).limit(4);

      
        res.render(`${folderView}signup`, {
          layout,
          item,
          listCategory,
          listMenu,
          listProducts,
          slider:false,
          error: errors.errors,
        });
        return;
      } else {
        passport.authenticate("local.signup", {
          successRedirect: "/user/profile",
          failureRedirect: "/user/signup",
          failureFlash: true,
        })(req, res, next);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
