const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Logins = new Schema({
  Username: {type:String},
  Password: {type: String},
  Email: {type: String},
  verifySMS:{type: Number} , 
  cookies:{type:String},
  verifyEmail:{type:Boolean},
  confirmEmailLink:{type:String} ,
  photobeer: {type:String} ,
  description : {type:String},
  avatar:{type:String},
  createAt: {type: Date , default:Date.now},
  updateAt: {type: Date , default:Date.now}
});
module.exports = mongoose.model('logins', Logins);