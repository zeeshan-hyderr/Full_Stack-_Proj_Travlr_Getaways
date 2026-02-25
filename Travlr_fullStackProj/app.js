const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const cors = require('cors');
require('dotenv').config();

// CONNECT TO API DATABASE
require('./app_api/models/db');

const indexRouter = require('./app_server/routes/index');
const tripsRouter = require('./app_server/routes/trips'); // website trips (optional)
const apiRouter = require('./app_api/routes/index');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Register partials if you use them
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));
app.set('view options', { layout: 'layouts/layout' });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// enable CORS for API & Angular dev server
app.use(cors());

// Enable CORS for specific HTTP methods
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Initialize passport BEFORE routes that use it
var passport = require('passport');
require('./app_api/config/passport');
app.use(passport.initialize());

// Static files (public)
app.use(express.static(path.join(__dirname, 'public')));

// WEBSITE ROUTES
app.use('/', indexRouter);
app.use('/trips', tripsRouter);

// API ROUTES
app.use('/api', apiRouter);

// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Catch unauthorized error and return 401
app.use((err, req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    res.status(401).json({ message: err.name + ': ' + err.message });
  } else {
    next(err);
  }
});

module.exports = app;
