const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    ordering: Number,
    status: String,
    attribute: String
},{ timestamps: true });

module.exports = mongoose.model(databaseConfig.col_attributes, schema );