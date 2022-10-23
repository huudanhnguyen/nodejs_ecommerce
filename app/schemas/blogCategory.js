const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    slug: String, 
    status: String,
    ordering: Number,
    parentId: String,
    blogArticle: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: databaseConfig.col_blogArticle
    }],
},{ timestamps: true });

module.exports = mongoose.model(databaseConfig.col_blogCategory, schema );