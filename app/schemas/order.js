
const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
  userId: { type: String, required: true },
  customer: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: "pending" },
  notes: { type: String, required: true },
  estimated_delivery: { type: String, required: true },
  tracking_id: { type: String, required: true },  
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
});

module.exports = mongoose.model(databaseConfig.col_orders, schema );
