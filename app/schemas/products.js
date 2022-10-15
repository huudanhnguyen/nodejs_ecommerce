const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    slug: String,
    thumbnail: String,
    thumb: Array,
    images: String,
    shortDes:String,
    description: String,
    status: String,
    ordering: Number,
    size: String,
    color: String,
    price: { type: Number, required: true },
    categoriesId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: databaseConfig.col_categories 
    }
},{ timestamps: true });

module.exports = mongoose.model(databaseConfig.col_products, schema );