const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TemplatePromptSchema = new Schema({
  name: {
      type: String,
      required: true
  },
  desc: {
      type: String
  },
  template: {
      type: String,
      required: true
  }
});
module.exports = mongoose.model('templatePrompt', TemplatePromptSchema);