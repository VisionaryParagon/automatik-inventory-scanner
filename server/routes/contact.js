const express = require('express');
const router = express.Router();

// contact model
const cont = require('../models/contact');

// get all contacts
router.get('/contacts', function (req, res) {
  cont.find({}, function (err, contacts) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(contacts);
  });
});

module.exports = router;
