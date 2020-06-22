"use strict"

const Job = require('./../models/job')

exports.getJobs = function(req, res, next) {
    Job.find({...req.query}, function(err, jobs){
        if (err)
            return next(err)
        return res.status(200).json(jobs)
    })
}

exports.addJob = function(req, res, next){
    const title = req.body.title
    const company = req.body.company
    const category = req.body.category
    const description = req.body.description
    const skills = req.body.skills
    const nature = req.body.nature
    const experienceLevel = req.body.experienceLevel
    const questions = req.body.questions
    if(!title)
        return res.status(422).json({error: "Title is required"})
    if(!company)
        return res.status(422).json({error: "Company is required"})
    if(!category)
        return res.status(422).json({error: "Category is required"})
    if(!description)
        return res.status(422).json({error: "Job description is required"})
    if(!skills)
        return res.status(422).json({error: "Skills are required"})
    if(!nature)
        return res.status(422).json({error: "Job Nature is required"})
    if(!experienceLevel)
        return res.status(422).json({error: "Experience Level is required"})
    if(!questions)
        return res.status(422).json({error: "Questions are required"})

    let job = new Job({
      title: title,
      company: company,
      category: category,
      description: description,
      skills: skills,
      nature: nature,
      experienceLevel: experienceLevel,
      questions: questions
    })
    job.save(function(err, job){
        if(err)
            return next(err)
        return res.status(201).json(job)
    })
}

exports.deleteJob = function(req, res, next){
    const _id = req.body._id
    Job.findOneAndDelete({
        _id: _id
    }, function(err, job){
        if(err){return next(err)}
        if(!job){
            return res.status(422).send({
                error: "No job exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}

exports.editJob = function(req, res, next){
    const _id = req.body._id
    Job.findOne({_id: _id}, function(err, job){
        if(err)
            return next(err)
        if(!job)
            return res.status(422).send({error: "No job exists with the provided _id!"})
        const title = req.body.title
        const company = req.body.company
        const category = req.body.category
        const description = req.body.description
        const skills = req.body.skills
        const nature = req.body.nature
        const experienceLevel = req.body.experienceLevel
        const questions = req.body.questions
        if(title)job.title = title
        if(company)job.company = company
        if(category)job.category = category
        if(description)job.description = description
        if(skills)job.skills = skills
        if(nature)job.nature = nature
        if(experienceLevel)job.experienceLevel = experienceLevel
        if(questions)job.questions = questions
        job.save(function(err, job){
            if(err)
                return next(err)
            res.status(200).json(job)
        })
    })
}

exports.addResponse = function(req, res, next){
    const _id = req.body._id
    Job.findOne({_id: _id}, function(err, job){
        if(err)
            return next(err)
        if(!job)
            return res.status(422).send({error: "No job exists with the provided _id!"})
        const user_id = req.user._id
        const question_responses = req.body.question_responses
        job.responses.push({user_id: user_id, question_responses: question_responses})
        job.save(function(err, job){
            if(err)
                return next(err)
            res.status(200).json(job)
        })
    })
}
