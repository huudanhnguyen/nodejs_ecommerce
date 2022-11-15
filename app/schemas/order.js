
const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: databaseConfig.col_users
  },
  customer: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: "pending" },
  notes: { type: String, required: true },
  products: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: { type: Number, required: true },
    },
  ],
  totalPrice:Number,
});

module.exports = mongoose.model(databaseConfig.col_orders, schema );
