const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String,
    phone: String,
    email: String,
    subject: String,
    message: String,
    ordering: Number,
    status: {
        type: String,
        default: 'inactive'
    }
},
{ timestamps: true }
);

module.exports = mongoose.model(databaseConfig.col_contact, schema );