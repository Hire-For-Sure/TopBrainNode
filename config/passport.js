// Importing Passport, strategies, and config
const passport = require('passport'),
      User = require('../models/user'),
      config = require('./main'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local').Strategy

const localOptions = { usernameField: 'username' }

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
  var queryOptions = (username.indexOf('@') === -1) ? { username: username } : { email: username }
  User.findOne(queryOptions, function(err, user) {
    if(err) { return done(err) }
    if(!user) { return done(null, false, { error: 'Your username or email could not be verified. Please try again.' }) }

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err) }
      if (!isMatch) { return done(null, false, { error: "Your password could not be verified. Please try again." }) }

      return done(null, user)
    })
  })
})

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
}

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload._id, function(err, user) {
    if (err) { return done(err, false) }

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

passport.use(jwtLogin)
passport.use(localLogin)
