"use strict"

const SuperQuiz = require('./../models/superquiz'),
Question = require('./../models/section').Question,
Score = require('./../models/score'),
_ = require('lodash')

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

async function calcPercentile(superquiz, user_scores) {
    let other_scores = []
    let percentile = 0
    let user_score = user_scores.map(item => item.score).reduce((prev, next) => prev + next)
    await Score.find({'scores.superquiz': superquiz}, {'scores.$': 1}, function(err, s){
        s.forEach(sc => {
            let arr = sc.scores[0].section_score
            const result = arr.map(item => item.score).reduce((prev, next) => prev + next)
            other_scores.push(result)
        })
        percentile = (100 * other_scores.reduce((acc, v) => acc + (v < user_score ? 1 : 0) + (v === user_score ? 0.5 : 0), 0)) / other_scores.length
    })
    return {other_scores: other_scores, percentile: percentile}
}

exports.getSuperQuizzes = function(req, res, next) {
    SuperQuiz.find({...req.query})
    .populate({path: "sections.section", populate: {path: "relevant_content", model: "Module"}})
    .populate('career_track', ['image', 'thumbnailUrl'])
    .exec(function(err, superquizzes){
        if (err)
        return next(err)
        superquizzes.forEach(superquiz => {
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
        })
        return res.status(200).json(superquizzes)
    })
}

exports.addSuperQuiz = function(req, res, next){
    const title = req.body.title
    const sections = req.body.sections
    const career_track_id = req.body.career_track_id
    if(!title)
    return res.status(422).json({"error": "Title is required"})
    if(!career_track_id)
    return res.status(422).json({"error": "CareerTrack id is required"})
    let superquiz = new SuperQuiz({
        title: title,
        career_track: career_track_id,
        sections: sections
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
        if(sections)superquiz.sections = sections
        superquiz.save(function(err, superquiz){
            if(err)
            return next(err)
            res.status(200).json(superquiz)
        })

    })
}

exports.calcScore = function(req, res, next){
    const _id = req.body._id
    const submitted_quiz = req.body.submitted_quiz
    var result = []
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
            let submitted_response = submitted_quiz.find(o => o.section_id == item.section._id ).response
            let questions = _.intersectionWith(item.section.questions, submitted_response, (o1, o2) => o1._id == o2.question_id)
            let new_questions = []
            questions.forEach(function(question){
                let submitted_question = submitted_response.find(o => o.question_id == question._id)
                if(submitted_question.answer == question.answer) score += 1
                new_questions.push({...question.toObject(), selected_choice: submitted_question.answer})
            })
            result.push({section_id: item.section._id, questions: new_questions, score: score})
        })
        async function foo(){
            const ans = await calcPercentile(_id, result)
            return res.status(200).json({
                result: result,
                percentile: ans.percentile,
                other_scores: ans.other_scores
            })
        }
        foo()
    })
}
