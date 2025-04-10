const mongoose = require('mongoose');

const tshirtSchema = new mongoose.Schema({
  type: String,
  fabric: String,
  color: String,
  size: {
    type: String,
    enum: ['M', 'L', 'XL']
  },
  soldTo: {
    type: String,
    default: ''
  },
  total: Number,
  sold: Number
});

module.exports = mongoose.model('Tshirt', tshirtSchema);