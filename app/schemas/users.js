const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var schema = new mongoose.Schema({ 
    avatar: String,
    username: String,
    email:String,
    password: String,
    status: String,
    isAdmin:String,
},{ timestamps: true });

schema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
});

module.exports = mongoose.model(databaseConfig.col_users, schema );