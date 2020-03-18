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
    if(!name)
        return res.status(422).json({error: "Name is required"})
    if(!link)
        return res.status(422).json({error: "Link is required"})
    if(!points)
        return res.status(422).json({error: "Points are required"})
    let challenge = new Challenge({
        name: name,
        link: link,
        points: points
    })
    challenge.save(function(err, challenge){
        if(err)
            return next(err)
        return res.status(201).json(challenge)
    })
}

exports.deleteChallenge = function(req, res, next){
    const _id = req.body._id
    Challenge.findOneAndDelete({
        _id: _id
    }, function(err, challenge){
        if(err){return next(err)}
        if(!challenge){
            return res.status(422).send({
                error: "No challenge exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })   
    })
}

exports.editChallenge = function(req, res, next){
    const _id = req.body._id
    Challenge.findOne({_id: _id}, function(err, challenge){
        if(err)
            return next(err)
        if(!challenge)
            return res.status(422).send({error: "No challenge exists with the provided _id!"})
        const name = req.body.name
        const link = req.body.link
        const points = req.body.points
        if(name)challenge.name = name        
        if(link)challenge.link = link
        if(typeof points !== Number)challenge.points = points
        challenge.save(function(err, challenge){
            if(err)
                return next(err)
            res.status(200).json(challenge)
        })

    })
}

