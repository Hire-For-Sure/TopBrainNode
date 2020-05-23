"use strict"

const Score = require('../models/score')

exports.getScores = function(req, res, next){
    const user = req.user._id
    Score.find({user: user}, function(err, score){
        if(err)
            return next(err)
        return res.status(200).json(score)
    })
}

exports.createScore = function(req, res, next){
    const user = req.user._id
    var scores = req.body.scores
    if(!scores)
        scores = []

    let score = new Score({
        user: user,
        scores: scores
    })
    score.save(function(err, score){
        if(err)
            return next(err)
        return res.status(201).json(score)
    })
}

exports.addScore = function(req, res, next){
    const user = req.user._id
    const superquiz = req.body.superquiz
    const section_score = req.body.section_score
    Score.findOne({user: user}, function(err, score){
        if(err) return next(err)
        if(!score){
            return res.status(422).send({
                error: "No Score exists with the provided _id!"
            })
        }

        score.scores.push({superquiz: quiz, section_score: section_score})
        score.save(function(err, score){
            if(err)
                return next(err)
            return res.status(201).json(score)
        })
    })
}

exports.deleteScores = function(req, res, next){
    const user = req.user._id
    Score.findOneAndDelete({
        user: user
    }, function(err, score){
        if(err)return next(err)
        if(!score){
            return res.status(422).send({
                error: "No Score exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}
