"use strict"

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
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

// Registration Route
exports.register = function(req, res, next) {
  // Check for registration errors
  const name = req.body.name
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

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

  User.findOne({ email: email }, function(err, existingUser) {
      if (err) { return next(err) }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' })
      }

      User.findOne({ username: username }, function(err, existingUser) {
          if (err) { return next(err) }

          // If user is not unique, return error
          if (existingUser) {
            return res.status(422).send({ error: 'That username is not available.' })
          }

          // If email and mobile number is unique and password was provided, create account
          let user = new User({
            username: username,
            email: email,
            password: password,
            profile: { name: name }
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
      })
  })
}

// Update Route
exports.update = function(req, res, next) {
  // Check for registration errors
  const _id = req.body._id
  const university = req.body.university
  const branch = req.body.branch
  const year_graduation = req.body.year_graduation
  const country = req.body.country
  const state = req.body.state
  const city = req.body.city
  const mobile_number = req.body.mobile_number

  const bio = req.body.bio
  const interests = req.body.interests

  User.findOne({ mobile_number: mobile_number }, function(err, existingUser) {
      if (err) { return next(err) }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That mobile number is already in use.' })
      }

      User.findOne({ _id: _id }, function(err, user) {
          if (err) {
            res.send({ error: err})
            return next(err)
          }

          if (university) { user.profile.university = university }
          if (branch) { user.profile.branch = branch }
          if (year_graduation) { user.profile.year_graduation = year_graduation }
          if (country) { user.profile.country = country }
          if (state) { user.profile.state = state }
          if (city) { user.profile.city = city }
          if (mobile_number) { user.mobile_number = mobile_number }

          if(bio) { user.bio = bio }
          if(interests) { user.interests = interests }

          user.save(function(err, user) {
            if (err) { return next(err) }

            // Respond with JWT if user was created
            let userInfo = setUserInfo(user)

            res.status(201).json({
              token: 'JWT ' + generateToken(userInfo),
              _id: user._id
            })
          })
      })
  })
}
