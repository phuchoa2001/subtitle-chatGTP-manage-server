const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true }
});

module.exports = mongoose.model('permission', permissionSchema);