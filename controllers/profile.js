"use strict"

const User = require('../models/user')

// Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    profile: request.profile,
    username: request.username,
    email: request.email,
    mobile_number: request.mobile_number,
    interests: request.interests,
    bio: request.bio
  }
}

// Get Profile Route
exports.getProfile = function(req, res, next){
	var queryOptions = (req.body._id) ? { '_id': req.body._id } : { '_id': req.user._id }
  User.findOne(queryOptions, function(err, user){
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
	User.findOneAndUpdate({ '_id': req.user._id }, { $push: { 'interests': { $each: interests } } }, function(err, user){
    if (err) {
      res.send({ error: err})
      return next(err)
    }
		res.status(200).json({ message: 'New Interests Added' })
  })
}
