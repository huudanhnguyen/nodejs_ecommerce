const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var schema = new mongoose.Schema({
    googleId: String,
    avatar: String,
    username: String,
    email:String,
    phone:String,
    address:String,
    status: {
      type: String,
      default: 'active'
    },    password: String,
    isAdmin: {
      type: String,
      default: 'no'
    },
},{ timestamps: true });
schema.methods.encryptPassword= async function(password){
  return await bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};
schema.methods.validPassword= async function(password){
  return await bcrypt.compareSync(password,this.password);
};

schema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});


module.exports = mongoose.model(databaseConfig.col_users, schema );