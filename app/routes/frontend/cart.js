const express = require("express");
const router = express.Router();
var fs = require("fs");
const { body, validationResult } = require("express-validator");
const notify = require(__path_configs + "notify");
var util = require("util");

const {
  col_products,
  col_menu,
  col_settings,
  col_categories,
} = require(__path_configs + "database");
const productsModel = require(__path_schemas + col_products);
const FrontEndHelpers = require(__path_helpers + "frontend");
const ParamsHelpers = require(__path_helpers + "params");
const settingsModel = require(__path_schemas + col_settings);
const categoryModel = require(__path_schemas + col_categories);
const TimeInRangeHelpers = require(__path_helpers + "checktimeinrange");

const Model = require(__path_models + "products");
const menuModel = require(__path_schemas + col_menu);
const folderView = __path_view_ecommerce + "pages/cart/";
const layout = __path_view_ecommerce + "frontend";
/* GET home page. */
router.get("/add/:id", async function (req, res, next) {
  let productId = ParamsHelpers.getParam(req.params, "id", "");
  productsModel.findOne({ id: productId }, function (err, p) {
    if (err) console.log(err);
    if (typeof req.session.cart == "undefined") {
      req.session.cart = [];
      req.session.cart.push({});
    }
  });
});
router.get("/", async (req, res, next) => {
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

  const listProducts = await productsModel.find({}).limit();

  const listMenu = await menuModel
    .find({ status: "active" })
    .sort({ ordering: "desc" });
  const listCategory = await categoryModel.find({}).sort({ ordering: "desc" });

  res.render(`${folderView}index`, {
    layout,
    listMenu,
    item,
    listProducts,
    listCategory,
    slider: false,
  });
});
router.post("/", async (req, res, next) => {
  try {
    let listIds = JSON.parse(req.body.data);
    let dataIds = listIds.map((item) => {
      return item.id;
    });
    let listProduct = await productsModel
      .find({ _id: { $in: dataIds } })
      .select("-description")
      .exec();
    console.log(listProduct);
    res.send({ success: true, data: listProduct });
  } catch (error) {
    console.log(error);
    res.send({ success: false, data: null });
  }
});
router.post(
  "/ma-giam-gia",
  body("couponCode")
    .isLength({ min: 4, max: 20 })
    .withMessage("Mã Khuyến Mãi Không Hợp Lệ"),
  async function (req, res, next) {
    try {
      let { couponCode } = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.send({ success: false, data: null });
        return;
      }
      let findCode = await FrontEndHelpers.getCodeCoupon({
        status: "active",
        name: couponCode,
      });
      if (findCode._doc) {
        if (TimeInRangeHelpers.checkTimeInRange(findCode._doc.dates)) {
          res.send({ success: true, data: findCode._doc });
          return;
        }
      }
      res.send({ success: false, data: null });
    } catch (error) {
      console.log(error);
      res.send({ success: false, data: null });
    }
  }
);

router.post(
  "/dat-hang",
  body("name")
    .isLength({ min: 2, max: 30 })
    .withMessage("Vui Lòng Nhập Tên Từ 2 đến 30 Ký Tự"),
  body("address")
    .isLength({ min: 10, max: 60 })
    .withMessage("Vui Lòng Nhập Địa Chỉ"),
  body("phoneNumber").isMobilePhone().withMessage("Số Điện Thoại Không Hợp Lệ"),
  async function (req, res, next) {
    try {
      let errors = validationResult(req);
      if (req.isAuthenticated() || true) {
        if (!errors.isEmpty()) {
          res.send({ success: false, errors: errors.errors });
          return;
        } else {
          // req.body.userId = req.user.id
          // req.body.email = req.user.email
          let processOrder = await FrontEndHelpers.addOrder(req.body);
          res.send(processOrder);
        }
      } else {
        res.send({
          success: false,
          errors: [
            {
              msg: notify.PRESS_F5,
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        success: false,
        errors: [
          {
            msg: notify.PRESS_F5,
          },
        ],
      });
    }
  }
);

module.exports = router;
