"use strict"

const User = require('../models/user')

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

// Get Profile Route
exports.getProfile = function(req, res, next){
  User.findOne({ '_id': req.body._id }, function(err, user){
    if (err) {
      res.send({ error: err})
      return next(err)
    }

    let userInfo = setUserInfo(user)

    res.status(200).json({ user: userInfo })
  })
}

// Adding more interests
exports.addInterests = function(req, res, next){
	const interests = req.body.interests
	User.findOneandUpdate({ '_id': req.user._id }, { $push: { 'interests': { $each: interests } } }, function(err, user){
    if (err) {
      res.send({ error: err})
      return next(err)
    }
		res.status(200).json({ message: 'New Interests Added' })
  })
}
