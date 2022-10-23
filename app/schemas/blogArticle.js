const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    title: String, 
    slug: String, 
    thumbnail: String, 
    description: String,
    status: String,
    ordering: Number,
    categoriesId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: databaseConfig.col_blogCategory 
    }
},{ timestamps: true });

module.exports = mongoose.model(databaseConfig.col_blogArticle, schema );