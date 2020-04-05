"use strict"

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      _ = require('lodash'),
      User = require('../models/user'),
      config = require('../config/main')

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    //expiresIn: 10800 // in seconds
  })
}

// Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    name: request.profile.name,
    university: request.profile.university,
    branch: request.profile.branch,
    year_graduation: request.profile.year_graduation,
    country: request.profile.country,
    state: request.profile.state,
    city: request.profile.city,
    username: request.username,
    email: request.email,
    mobile_number: request.mobile_number,
    interests: request.interests,
    bio: request.bio
  }
}

// Login Route
exports.login = function(req, res, next) {
  let userInfo = setUserInfo(req.user)

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    _id: req.user._id
  })
}

// Unique Check Route
exports.verify = function(req, res, next) {
  const username = req.body.username
  const email = req.body.email
  const mobile_number = req.body.mobile_number
  
  let options = []
  if(username) options.push({ username: username })
  if(email) options.push({ email: email })
  if(mobile_number) options.push({ mobile_number: mobile_number })
  
  User.find({ $or: options }, function(err, users){
    if(err) {
      return next(err);
    } else if(users) {
        if (_.find(users, {email: email})){
            return res.status(422).send({ error: 'That username is already taken.' })
        } else if (_.find(users, {username: username})){
            return res.status(422).send({ error: 'That email address is already registered.' })
        } else if (_.find(users, {mobile_number: mobile_number})){
            return res.status(422).send({ error: 'That mobile number is already in use.' })
        } else {
            return res.status(200).json({
                message: 'Success'
            })
        }
    }
  })
}

// Registration Route
exports.register = function(req, res, next) {
  // Check for registration errors
  const name = req.body.name
  const username = req.body.username
  const email = req.body.email
  const mobile_number = req.body.mobile_number
  const password = req.body.password
  const university = req.body.university
  const branch = req.body.branch
  const year_graduation = req.body.year_graduation
  const country = req.body.country
  const state = req.body.state
  const city = req.body.city
  const bio = req.body.bio
  const interests = req.body.interests

  // Return error if name not provided
  if (!name) {
    return res.status(422).send({ error: 'You must enter your name.'})
  }
  // Return error if no username provided
  if (!username) {
    return res.status(422).send({ error: 'You must enter an username.'})
  }
  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'})
  }
  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' })
  }
  
  if(!interests) {
    interests = []
  }

  let user = new User({
    username: username,
    email: email,
    mobile_number: mobile_number,
    password: password,
    profile: { name: name, university: university, branch: branch, year_graduation: year_graduation, country: country, state: state, city: city },
    bio: bio,
    interests: interests
  })

  user.save(function(err, user) {
    if (err) { return next(err) }

    // Respond with JWT if user was created
    let userInfo = setUserInfo(user)

    res.status(201).json({
      token: 'JWT ' + generateToken(userInfo),
      _id: user._id
    })
  })
}
