"use strict"

const Challenge = require('./../models/challenge')

exports.getChallenges = function(req, res, next) {
    Challenge.find(function(err, challenges){
        if (err)
            return next(err)
        return res.status(200).json(challenges)
    })
}

exports.addChallenge = function(req, res, next){
    const name = req.body.name
    const link = req.body.link
    const points = req.body.points
    let challenge = new Blog({
        name: name,
        link: link,
        points: points
    })
    challenge.save(function(err, blog){
        if(err)
            return next(err)
        res.status(201).json(challenge)
    })
}

