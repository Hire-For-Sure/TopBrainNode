"use strict"

const Quiz = require('../models/quiz')

exports.getQuizzes = function(req, res, next){
    Quiz.find({...req.query}, function(err, quizzes){
        if(err)
            return next(err)
        return res.status(200).json(quizzes)
    })
}

exports.addQuiz = function(req, res, next){
    const title = req.body.title
    const description = req.body.description
    const difficulty = req.body.difficulty
    var questions = req.body.questions
    if(!title)
        return res.status(422).json({"error": "Title is required"})
    if(!description)
        return res.status(422).json({"error": "Description is required"})
    if(!difficulty)
        return res.status(422).json({"error": "Difficulty is required"})
    if(!questions)
        questions = []
    
    let quiz = new Quiz({
        title: title,
        description: description,
        difficulty: difficulty,
        questions: questions
    })
    quiz.save(function(err, quiz){
        if(err)
            return next(err)
            
        return res.status(201).json(quiz)
    })
}

exports.deleteQuiz = function(req, res, next){
    const _id = req.body._id
    Quiz.findOneAndDelete({
        _id: _id
    }, function(err, quiz){
        if(err)return next(err)
        if(!quiz){
            return res.status(422).send({
                error: "No Quiz exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}

exports.editQuiz = function(req, res, next){
    const _id = req.body._id
    Quiz.findOne({_id: _id}, function(err, quiz){
        if(err)
            return next(err)
        if(!quiz)
            return res.status(422).send({error: "No Quiz exists with the provided _id!"})
        const title = req.body.title
        const description = req.body.description
        const difficulty = req.body.difficulty
        const questions = req.body.questions
        if(title)quiz.title = title
        if(description)quiz.description = description
        if(difficulty)quiz.difficulty = difficulty
        if(questions)quiz.questions = questions
        quiz.save(function(err, quiz){
            if(err)
                return next(err)
            return res.status(200).json(quiz)
        })
    })
}

exports.addQuestion = function(req, res, next){
    const _id = req.body._id
    Quiz.findOne({_id: _id}, function(err, quiz){
        if(err)
            return next(err)
        if(!quiz)
            return res.status(422).send({error: "No Quiz exists with the provided _id!"})
        const text = req.body.text
        const choices = req.body.choices
        const answer = req.body.answer
        
        let question = {
            text: text,
            choices: choices,
            answer: answer
        }
        
        if(question) quiz.questions.push(question)
        quiz.save(function(err, quiz){
            if(err)
                return next(err)
            return res.status(200).json(quiz)
        })
    })
}
