const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const subtitleWaitingSchema = new Schema({
    name: { type: String, required: true , unique: true },
    courseName : { type: String} , 
    permission : { type: String} , 
    data : { type: Array, required: true }
});
module.exports = mongoose.model('subtitleWaiting', subtitleWaitingSchema);