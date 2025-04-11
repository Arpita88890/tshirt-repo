const mongoose = require('mongoose');
const kidsTshirtSchema = new mongoose.Schema({
  type: String,
  fabric: String,
  color: String,
  size: String,
  total: Number,
  sold: Number,
  soldTo: String,
});
module.exports = mongoose.model('KidsTshirt', kidsTshirtSchema);