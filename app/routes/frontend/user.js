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
  });
});
router.post("/signin", async (req, res, next) => {
  if (req.isAuthenticated()) res.redirect("/");
  req.body = JSON.parse(JSON.stringify(req.body));
  console.log(req.body);
  passport.authenticate("local.signin", {
    successRedirect: "/",
    failureRedirect: "/user/signin",
    failureFlash: true,
  })(req, res, next);
});
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
  body("email").isEmail().normalizeEmail().withMessage("sai email"),
  body("name").isLength({ min: 2, max: 20 }).withMessage("sai ten"),
  body("password").custom((value, { req }) => {
    let { confirmpassword, password } = req.body;

    if (!confirmpassword || !password) {
      return Promise.reject("chua nhap mat khau");
    }
    if (
      confirmpassword.length < 8 ||
      confirmpassword.length > 18 ||
      password.length < 8 ||
      password.length > 18
    ) {
      return Promise.reject("mat khau kkhong hop le");
    }
    if (password != confirmpassword) {
      return Promise.reject("mat khau khong khop");
    }
    return Promise.resolve();
  }),
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) res.redirect("/");
      req.body = JSON.parse(JSON.stringify(req.body));
      let user=req.body;
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
          user,
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
          successRedirect: "/",
          failureRedirect: "/user/signup",
          failureFlash: true,
        })(req, res, next);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    // passport.authenticate('local.signup', {
    //   successRedirect:'/',
    //   failureRedirect: '/user/signup',
    //   failureFlash:true,
    // })(req,res,next);
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
