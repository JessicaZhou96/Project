const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var memberSchema = new Schema({
  id: String,
  name: String,
  email: String,
  phone: String
});

module.exports = mongoose.model('Member', memberSchema);