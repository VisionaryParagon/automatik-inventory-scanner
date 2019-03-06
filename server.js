// dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// get env vars
const dotenv = require('dotenv');
dotenv.config();

// db
/*
mongoose.connect('mongodb://' + process.env.DBUSR + ':' + process.env.DBPWD + '@ds237379.mlab.com:37379/automatik-apps', {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
})
  .then(dbRes => console.log('Connected to DB:', dbRes.connections[0].name))
  .catch(dbErr => console.log('Error connecting to DB:', dbErr));
*/

mongoose.connect('mongodb://' + process.env.DBUSR + ':' + encodeURIComponent(process.env.DBPWDPROD) + '@ds219175-a0.mlab.com:19175,ds219175-a1.mlab.com:19175/automatik-apps?replicaSet=rs-ds219175', {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
})
  .then(dbRes => console.log('Connected to DB:', dbRes.connections[0].name))
  .catch(dbErr => console.log('Error connecting to DB:', dbErr));

// models
const admin = require('./server/models/admin');

// routes
const contactRoute = require('./server/routes/contact');
const inventoryRoute = require('./server/routes/inventory');
const adminRoute = require('./server/routes/admin');

// Express server
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressSession({
  secret: process.env.AUTOMATIK_KEY,
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
app.all('*', (req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https' || req.headers.host !== 'inventory.automatik.com') {
  // if (req.headers['x-forwarded-proto'] === 'https' || (req.headers.host !== 'automatik.com' && req.headers.host !== 'www.automatik.com')) {
    next();
  } else {
    console.log(req.protocol + process.env.PORT + '' + req.hostname + req.url);
    return res.redirect('https://' + req.get('host') + req.url);
  }
});

// API endpoints
app.use('/dir', contactRoute);
app.use('/inv', inventoryRoute);
app.use('/admn', adminRoute);

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve all other routes through index.html
app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// get port from environment and store in Express
const port = process.env.PORT || '80';
app.set('port', port);

// create HTTP server
const server = http.createServer(app);

// listen on provided port, on all network interfaces
server.listen(port, () => console.log(`API running on localhost:${port}`));
