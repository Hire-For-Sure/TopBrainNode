"use strict"

const Score = require('../models/score'),
      SuperQuiz = require('../models/superquiz'),
      _ = require('lodash')

exports.getScores = function(req, res, next){
    const user = req.user._id
    Score.findOne({user: user}, async function(err, score){
        if(err)
            return next(err)
        let arr = []
        for(let i = 0; i < score.scores.length; i++){
            var sc = score.scores[i].toObject()
            let percentile = 0
            await SuperQuiz.findOne({_id: sc.superquiz}, function(err, superquiz){
                let user_score = sc.section_score.map(item => item.score).reduce((prev, next) => prev + next)
                let other_scores = [0]
                superquiz.scoresTable.forEach((val, index) => {
                    while(val--)
                        other_scores.push(index)
                })
                percentile = (100 * other_scores.reduce((acc, v) => acc + (v < user_score ? 1 : 0) + (v === user_score ? 0.5 : 0), 0)) / other_scores.length
            })
            sc.percentile = percentile
            score.scores[i] = sc
        }
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
