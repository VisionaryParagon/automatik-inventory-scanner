const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  checked: String,
  items: Array,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('users', UserSchema);
