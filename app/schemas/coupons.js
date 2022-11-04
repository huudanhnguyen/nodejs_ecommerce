const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    values: Number,
    quantity: Number,
    used: Number,
    dates: String,
    status: String,
    type: String
    
},{ timestamps: true });

module.exports = mongoose.model(databaseConfig.col_coupons, schema );