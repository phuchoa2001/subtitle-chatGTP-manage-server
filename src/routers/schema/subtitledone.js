const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const subtitleDoneSchema = new Schema({
    name: { type: String, required: true },
    permission : { type: String} , 
    courseName : { type: String} , 
    data : { type: Array, required: true }
});
module.exports = mongoose.model('subtitleDone', subtitleDoneSchema);