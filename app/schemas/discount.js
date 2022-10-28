const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    description: String,
    discountValue: {
        unit: String,
        value: Number,
    },
    ordering: Number,
    status: String,
    time: String,
    expired: Boolean,
    productList: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: databaseConfig.col_products
    }],
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_discount, schema );