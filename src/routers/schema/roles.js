const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RoleSchema = new Schema({
  name: {
      type: String,
      required: true
  },
  desc: {
      type: String
  }
});

module.exports = mongoose.model('roles', RoleSchema);