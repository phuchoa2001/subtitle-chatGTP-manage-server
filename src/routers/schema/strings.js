const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const StringsWithRoleSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'roles',
    required: true
  }
});
module.exports = mongoose.model('strings', StringsWithRoleSchema);