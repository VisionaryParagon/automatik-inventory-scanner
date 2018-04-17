// dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const hash = require('bcrypt-nodejs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// db
mongoose.connect('mongodb://admin:Automatik@ds237379.mlab.com:37379/automatik-apps', {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
});

// models
const admin = require('./server/models/admin');

// get routes
const contactRoute = require('./server/routes/contact');
const inventoryRoute = require('./server/routes/inventory');
const userRoute = require('./server/routes/user');
const adminRoute = require('./server/routes/admin');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressSession({
  secret: 'automatikKey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(admin.authenticate()));
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());

// https redirect
function ensureSecure(req, res, next) {
  if (req.headers['x-forwarded-proto'] == 'https' || req.headers.host != 'inventory.automatik.us') {
    next();
  } else {
    if (req.headers.host.indexOf('www.') === 0) {
      return res.redirect(301, 'https://' + req.headers.host.slice(4) + req.url);
    } else {
      return res.redirect(301, 'https://' + req.headers.host + req.url);
    }
  }
}

// set routes
app.all('*', ensureSecure);
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/dir', contactRoute);
app.use('/inv', inventoryRoute);
app.use('/usr', userRoute);
app.use('/admn', adminRoute);
app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Get port from environment and store in Express
const port = process.env.PORT || '80';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port, () => console.log(`API running on localhost:${port}`));
