const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const bookshopSchema = new Schema({
    name: { type: String, required: true }
});
module.exports = mongoose.model('bookshop', bookshopSchema);