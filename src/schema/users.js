const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  age: {
    type: Number,
    required: true,
    min: 12,
    max: 99
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permission: { type: String, required: true },
  token: { type: String }
});

module.exports = mongoose.model('users', userSchema);