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
