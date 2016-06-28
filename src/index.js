var express = require('express');
var app = express();

var errorHandlers = require('./errorHandlers')

// Main API router
var router = require('express').Router()

if (process.env.NODE_ENV != 'production') {
  // Allow CORS
  router.use(require('cors')())
}

// Necessary middleware
router.use(require('morgan')('dev'));
router.use(require('cookie-parser')());
router.use(require('body-parser').urlencoded({ extended: true }));

// Route "groups" (kinda controllers)
router.use('/auth', require('./auth'))

// Error handlers
router.use(errorHandlers.sequelizeValidationError)
router.use(errorHandlers.logErrors)
router.use(errorHandlers.defaultErrorHandler)

/// Use the API router for all routes starting from '/api'
app.use('/api', router)

// Serve static files and allow history API fallback
app.use(express.static('public'))
app.use(require('express-history-api-fallback')('index.html', { root: `${__dirname}/../public` }))

// Create sample models
require('./models/createSampleModels')()

// Start the server on the specified port or 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT);
