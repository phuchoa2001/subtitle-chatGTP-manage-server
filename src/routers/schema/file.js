const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
  public_id : { type: String, required: true },
  format : { type: String, required: true }
});

module.exports = mongoose.model('files', fileSchema);