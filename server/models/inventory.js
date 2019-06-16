const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  item: String,
  checked: String,
  name: String,
  reason: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('inventory-items', InventorySchema);
