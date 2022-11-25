
const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: databaseConfig.col_users
  },
  name: String,
  trackingCode: String,
  phoneNumber: String,
  couponCode: String,
  status: {
      type: Number,
      default: 0
  },
  productList: String,
  couponValue: Number,
  costShip: Number,
  priceProduct: Number,
  totalMoney: Number,
  notes: String,
},
{ timestamps: true }
);
module.exports = mongoose.model(databaseConfig.col_orders, schema );
