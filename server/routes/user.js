const express = require('express');
const router = express.Router();

// user model
const user = require('../models/user');

// validate SID/TID
router.post('/users/sid', function (req, res) {
  user.findOne({ sid: req.body.sid }, function (err, data) {
    let user = {
      valid: false,
      data: data
    }
    if (err) return res.status(500).send(err);
    if (!data) return res.status(200).send(user);
    user.valid = true;
    return res.status(200).send(user);
  });
});

// get all users
router.get('/users', function (req, res) {
  user.find({}, function (err, users) {
    if (err) return res.status(500).send(err);
    return res.status(200).send(users);
  });
});

// get one user
router.get('/users/:id', function (req, res) {
  user.findById(req.params.id, function (err, user) {
    let notFound = {
      message: 'User not in system'
    }
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send(notFound);
    return res.status(200).send(user);
  });
});

// update user
router.put('/users/:id', function (req, res) {
  user.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, function (err, user) {
    if (err) return res.status(500).send(err);
    res.status(200).send(user);
  });
});

module.exports = router;
