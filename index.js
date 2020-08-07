// Importing Node modules and initializing Express
const express = require('express'),
      fs = require('fs'),
      app = express(),
      bodyParser = require('body-parser'),
      logger = require('morgan'),
      mongoose = require('mongoose'),
      config = require('./config/main'),
      router = require('./router')

// Database Connection
mongoose.connect(config.database)

// Start the server
const server = app.listen(config.port, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
console.log('Your server is running on port ' + config.port + '.')

// Setting up basic middleware for all Express requests
app.use(logger('dev')) // Log requests to API using morgan
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

router(app)
