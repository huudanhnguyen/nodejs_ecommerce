var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_view_ecommerce+ 'frontend';
const { body, validationResult } = require('express-validator');

const pageTitle ='Tra Cứu Đơn Hàng'
const folderView	 = __path_view_ecommerce + 'pages/order/';
const FrontEndHelpers = require(__path_helpers + 'frontend');

router.get('/', 
    async function(req, res, next) {
        try {
                let orderData = {}
                console.log(req.query);
                if(req.query.trackingCode){
                    orderData = await FrontEndHelpers.getOrderByTrackingCode(req.query.trackingCode)
                    console.log(orderData);
                    res.send({success: true, data: orderData})

                } else{
                    res.render(`${folderView}index`, {
                        pageTitle,
                        layout,
                        orderData,
                    }); 
                }
        } catch (error) {
            res.send({success: false, data: null})
            console.log(error)
        }
  });

module.exports = router;


