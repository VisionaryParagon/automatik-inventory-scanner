const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  image: String
});

module.exports = mongoose.model('contacts', ContactSchema);
