"use strict"

const Section = require('../models/section').Section,
      _ = require('lodash')

exports.getSections = function(req, res, next){
    Section.find({...req.query}, function(err, sections){
        if (err) {
            return res.send({ error: err})
        }
        sections.forEach(function(section){
            let questions = section.questions
            questions.forEach(function(question, index){
                this[index] = _.pick(question, ['_id', 'question', 'choices'])
            }, questions)
        })
        return res.status(200).json(sections)
    })
}

exports.getAdminSections = function(req, res, next){
    Section.find({...req.query}, function(err, sections){
        if (err) {
            return res.send({ error: err})
        }
        return res.status(200).json(sections)
    })
}

exports.addSection = function(req, res, next){
    const title = req.body.title
    const description = req.body.description
    var questions = req.body.questions
    const relevant_content = req.body.relevant_content
    if(!title)
        return res.status(422).json({"error": "Title is required"})
    if(!description)
        return res.status(422).json({"error": "Description is required"})
    if(!relevant_content)
        return res.status(422).json({"error": "Relevant Modules are required"})
    if(!questions)
        questions = []

    let section = new Section({
        title: title,
        description: description,
        relevant_content: relevant_content,
        questions: questions
    })
    section.save(function(err, section){
        if (err) {
            return res.send({ error: err})
        }

        return res.status(201).json(section)
    })
}

exports.deleteSection = function(req, res, next){
    const _id = req.body._id
    Section.findOneAndDelete({
        _id: _id
    }, function(err, section){
        if (err) {
            return res.send({ error: err})
        }
        if(!section){
            return res.status(422).send({
                error: "No Section exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}

exports.editSection = function(req, res, next){
    const _id = req.body._id
    Section.findOne({_id: _id}, function(err, section){
        if (err) {
            return res.send({ error: err})
        }
        if(!section)
            return res.status(422).send({error: "No Section exists with the provided _id!"})
        const title = req.body.title
        const description = req.body.description
        const relevant_content = req.body.relevant_content
        const questions = req.body.questions
        if(title)section.title = title
        if(description)section.description = description
        if(relevant_content)section.relevant_content = relevant_content
        if(questions)section.questions = questions
        section.save(function(err, section){
            if (err) {
                return res.send({ error: err})
            }
            return res.status(200).json(section)
        })
    })
}

exports.addQuestion = function(req, res, next){
    const _id = req.body._id
    Section.findOne({_id: _id}, function(err, section){
        if (err) {
            return res.send({ error: err})
        }
        if(!section)
            return res.status(422).send({error: "No Section exists with the provided _id!"})
        const text = req.body.question
        const choices = req.body.choices
        const answer = req.body.answer
        const explaination = req.body.explaination
        if(choices.length!==4) return res.status(422).json({message: 'Question must have 4 choices.'})

        let question = {
            question: text,
            choices: choices,
            answer: answer,
            explaination: explaination
        }

        if(question) section.questions.push(question)
        section.save(function(err, section){
            if (err) {
                return res.send({ error: err})
            }
            return res.status(200).json(section)
        })
    })
}
