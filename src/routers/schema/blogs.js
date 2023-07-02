const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const blogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, required: true, ref: "category" }],
  bookshop: [{ type: Schema.Types.ObjectId, required: true, ref: "bookshop" }],
  view: { type: Number, default: 0 }
});

module.exports = mongoose.model('blog', blogSchema);