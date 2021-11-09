const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const posts = new Schema({
  name: {type:String},
  content: {type: String},
  like: {type: Object},
  comment:{type: Array},
  avatar:{type:String},
  createAt: {type: Date , default:Date.now},
  updateAt: {type: Date , default:Date.now}
});
module.exports = mongoose.model('posts', posts);