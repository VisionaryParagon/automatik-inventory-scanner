const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  items: Array,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('inventory-users', UserSchema);
