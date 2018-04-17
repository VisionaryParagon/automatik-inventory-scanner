const express = require('express');
const router = express.Router();

// user model
const user = require('../models/user');

// create new user
router.post('/users', function (req, res) {
  user.create(req.body, function (err, user) {
    if (err) return res.status(500).send(err);
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

// get one user by name
router.post('/users/name', function (req, res) {
  user.findOne({ name: req.body.name }, function (err, data) {
    const info = {
      valid: false,
      data: data
    }
    if (err) return res.status(500).send(err);
    if (!data) return res.status(200).send(info);
    info.valid = true;
    return res.status(200).send(info);
  });
});

// get one user by id
router.get('/users/:id', function (req, res) {
  user.findById(req.params.id, function (err, user) {
    const notFound = {
      message: 'User not in system'
    }
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send(notFound);
    return res.status(200).send(user);
  });
});

// delete user
router.delete('/users/:id', function (req, res) {
  cont.findByIdAndRemove(req.params.id, function (err, user) {
    const deleted = {
      message: 'User deleted'
    }
    if (err) return res.status(500).send(err);
    res.status(200).send(deleted);
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
