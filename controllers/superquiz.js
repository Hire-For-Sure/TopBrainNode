"use strict"

const SuperQuiz = require('./../models/superquiz'),
Question = require('./../models/section').Question,
Score = require('./../models/score'),
_ = require('lodash'),
moment = require('moment-timezone')

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

exports.getSuperQuizzes = function(req, res, next) {
    SuperQuiz.findOne({...req.query})
    .populate({path: "sections.section"})
    .exec(function(err, superquiz){
        if (err)
        return next(err)

        let sections = superquiz.sections
        sections.forEach(function(item, index){
            let questions = shuffle(item.section.questions).slice(0, item.count)
            questions.forEach(function(question, index){
                this[index] = _.pick(question, ['_id', 'question', 'choices'])
            }, questions)
            let new_item = item
            new_item.section.questions = questions
            this[index] = new_item
        }, sections)
        superquiz = _.pick(superquiz, ['_id', 'title', 'sections'])

        return res.status(200).json(superquiz)
    })
}

exports.getAdminSuperQuizzes = function(req, res, next) {
    SuperQuiz.find({...req.query})
    .exec(function(err, superquizzes){
        if (err)
        return next(err)
        superquizzes.forEach(function(superquiz, index){
            this[index] = _.pick(superquiz, ['_id', 'title', 'sections'])
        }, superquizzes)
        return res.status(200).json(superquizzes)
    })
}

exports.addSuperQuiz = function(req, res, next){
    const title = req.body.title
    const sections = req.body.sections
    let len = sections.map(item => item.count).reduce((prev, next) => prev + next) + 1
    let scoresTable = new Array(len).fill(0)
    if(!title)
    return res.status(422).json({"error": "Title is required"})
    let superquiz = new SuperQuiz({
        title: title,
        sections: sections,
        scoresTable: scoresTable
    })
    superquiz.save(function(err, superquiz){
        if(err)
        return next(err)

        res.status(201).json({
            _id: superquiz._id
        })
    })
}

exports.deleteSuperQuiz = function(req, res, next){
    const _id = req.body._id
    SuperQuiz.findOneAndDelete({
        _id: _id
    }, function(err, superquiz){
        if(err){return next(err)}
        if(!superquiz){
            return res.status(422).send({
                error: "No superquiz exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}

exports.editSuperQuiz = function(req, res, next){
    const _id = req.body._id
    SuperQuiz.findOne({_id: _id}, function(err, superquiz){
        if(err)
        return next(err)
        if(!superquiz)
        return res.status(422).send({error: "No superquiz exists with the provided _id!"})
        const sections = req.body.sections
        if(sections){
            superquiz.sections = sections
            let len = sections.map(item => item.count).reduce((prev, next) => prev + next)
            superquiz.scoresTable = new Array(len).fill(0)
        }
        superquiz.save(function(err, superquiz){
            if(err)
            return next(err)
            res.status(200).json(superquiz)
        })
    })
}

exports.calcScore = function(req, res, next){
    const user = req.user._id
    const _id = req.body._id
    const submitted_quiz = req.body.submitted_quiz
    var result = []
    let other_scores = [0]
    let user_score = 0
    SuperQuiz.findOne({_id: _id})
    .populate({path: "sections.section"})
    .exec(function(err, superquiz){
        if(err)
        return next(err)
        if(!superquiz)
        return res.status(422).send({error: "No SuperQuiz exists with the provided _id!"})
        let sections = superquiz.sections
        sections.forEach(function(item){
            var score = 0
            var maxScore = 0
            let submitted_response = submitted_quiz.find(o => o.section_id == item.section._id ).response
            let questions = _.intersectionWith(item.section.questions, submitted_response, (o1, o2) => o1._id == o2.question_id)
            questions.forEach(function(question){
                let submitted_question = submitted_response.find(o => o.question_id == question._id)
                if(submitted_question.answer == question.answer) score += 1
            })
            result.push({section: {_id: item.section._id, title: item.section.title, description: item.section.description, relevant_content: item.section.relevant_content}, score: score, maxScore: questions.length})
        })

        Score.findOne({user: user}, function(err, score){
            if(err) return next(err)
            if(!score){
                let newScore = new Score({
                    user: user,
                    scores: [{superquiz: _id, section_score: result}]
                })
                newScore.save(function(err, newScore){
                    if(err)
                    console.log(err)
                    else console.log("Score for the user created")
                })
            }else {
                score.scores.push({superquiz: _id, section_score: result})
                score.save(function(err, score){
                    if(err)
                    return next(err)
                    console.log("Score added to the user")
                })
            }
        })
        user_score = result.map(item => item.score).reduce((prev, next) => prev + next)
        superquiz.scoresTable.forEach((val, index) => {
            while(val--)
            other_scores.push(index)
        })
        let percentile = (100 * other_scores.reduce((acc, v) => acc + (v < user_score ? 1 : 0) + (v === user_score ? 0.5 : 0), 0)) / other_scores.length
        superquiz.scoresTable.set(user_score, superquiz.scoresTable[user_score]+1)
        superquiz.save(function(err, doc){
            if(err)
            return next(err)
            Score.findOne({user: user}, function(err, score){
                if(err)
                console.log(err)
                var sc = score.toObject()
                var sco = sc.scores.pop()
                sco.section_score = result
                sco.createdAt = moment.tz(sco.createdAt, 'Asia/Colombo').format('MMMM DD, YYYY, hh:mm:ss A')
                sco.percentile = percentile
                sco.superquiz = {_id: _id, title: superquiz.title}
                sc.scores = [sco]
                return res.status(200).json(sc)
            })
        })
    })
}
