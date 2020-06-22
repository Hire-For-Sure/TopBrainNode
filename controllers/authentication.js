"use strict"

const jwt = require('jsonwebtoken'),
crypto = require('crypto'),
_ = require('lodash'),
User = require('../models/user'),
config = require('../config/main')

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 10800 // in seconds
    })
}

// Set user info from request
function setUserInfo(request) {
    return {
        _id: request._id,
        email: request.profile,
        personalInfo: request.personalInfo
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
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const user_type = req.body.user_type
    const password = req.body.password

    // Return error if first name not provided
    if (!first_name) {
        return res.status(422).send({ error: 'You must enter your first name.'})
    }
    // Return error if no email provided
    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address.'})
    }
    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' })
    }

    let user = new User({
        profile: {
            first_name: first_name,
            last_name: last_name,
            user_type: user_type
        },
        personalInfo: {
            email: email
        },
        password: password,
        education: {},
        work_experience: {},
        tech_experience: {}
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
