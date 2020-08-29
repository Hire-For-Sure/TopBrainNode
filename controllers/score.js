"use strict"

const Score = require('../models/score'),
SuperQuiz = require('../models/superquiz'),
_ = require('lodash'),
moment = require('moment-timezone')

exports.getScores = function(req, res, next){
    const user = req.user._id
    Score.findOne({user: user})
    .populate({path:'scores.superquiz', select: 'title'})
    .populate({path: 'scores.section_score.section', select: ['title', 'description', 'relevant_content']})
    .exec(async function(err, score){
        if (err) {
            return res.send({ error: err})
        }
        if(!score){
            return res.status(422).send({
                error: "No Score exists with the provided user _id!"
            })
        }
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
            sc.createdAt = moment.tz(sc.createdAt, 'Asia/Colombo').format('MMMM DD, YYYY, hh:mm:ss A')
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
        if (err) {
            return res.send({ error: err})
        }
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
