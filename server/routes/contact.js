const express = require('express');
const router = express.Router();

// contact model
const cont = require('../models/contact');

// create new contact
router.post('/contacts', function (req, res) {
  cont.create(req.body, function (err, contact) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(contact);
  });
});

// get all contacts
router.get('/contacts', function (req, res) {
  cont.find({}, function (err, contacts) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(contacts);
  });
});

// get one contact
router.get('/contacts/:id', function (req, res) {
  cont.findById(req.params.id, function (err, contact) {
    let notFound = {
      message: 'Contact not in system'
    }
    if (err) return res.status(500).send(err);
    if (!contact) return res.status(404).send(notFound);
    return res.status(200).send(contact);
  });
});

// delete contact
router.delete('/contacts/:id', function (req, res) {
  cont.findByIdAndRemove(req.params.id, function (err, contact) {
    let deleted = {
      message: 'Contact deleted'
    }
    if (err) return res.status(500).send(err);
    res.status(200).send(deleted);
  });
});

// update contact
router.put('/contacts/:id', function (req, res) {
  cont.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, function (err, contact) {
    if (err) return res.status(500).send(err);
    res.status(200).send(contact);
  });
});

module.exports = router;
