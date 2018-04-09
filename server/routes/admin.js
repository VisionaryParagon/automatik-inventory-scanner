const express = require('express');
const router = express.Router();
const passport = require('passport');

// user model
const User = require('../models/admin');

// register new user
router.post('/register', function (req, res) {
  User.register(new User({
      username: req.body.username
    }),
    req.body.password,
    function (err, account) {
      if (err) return res.status(500).send(err);

      passport.authenticate('local')(req, res, function () {
        return res.status(200).send({
          status: 'Registration successful!'
        });
      });
    });
});

// login user
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send(info);
    req.logIn(user, function (err) {
      if (err) return res.status(500).send(err);
      return res.status(200).send({
        message: 'Login successful!'
      });
    });
  })(req, res, next);
});

// logout user
router.get('/logout', function (req, res) {
  req.logout();
  return res.status(200).send({
    status: 'Bye!'
  });
});

// get user status
router.get('/status', function (req, res) {
  if (!req.isAuthenticated()) return res.status(200).send({
    auth: false
  });
  return res.status(200).send({
    auth: true
  });
});

module.exports = router;
