const express = require('express');
const router = express.Router();

// inventory model
const inventory = require('../models/inventory');

// create new item
router.post('/items', function (req, res) {
  inventory.create(req.body, function (err, item) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(item);
  });
});

// get all items
router.get('/items', function (req, res) {
  inventory.find({}, function (err, items) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(items);
  });
});

// get one item
router.get('/items/:id', function (req, res) {
  inventory.findById(req.params.id, function (err, item) {
    const notFound = {
      message: 'Item not in system'
    }
    if (err) return res.status(500).send(err);
    if (!item) return res.status(404).send(notFound);
    return res.status(200).send(item);
  });
});

// delete item
router.delete('/items/:id', function (req, res) {
  inventory.findByIdAndRemove(req.params.id, function (err, item) {
    const deleted = {
      message: 'Item deleted'
    }
    if (err) return res.status(500).send(err);
    res.status(200).send(deleted);
  });
});

// update one item
router.put('/items/:id', function (req, res) {
  inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, function (err, item) {
    if (err) return res.status(500).send(err);
    res.status(200).send(item);
  });
});

module.exports = router;
