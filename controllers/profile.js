"use strict"

const User = require('../models/user'),
      kue = require('kue')

require('./../services/thumbnailworker')

let queue = kue.createQueue({
  prefix: 'q',
  redis: {
    host: 'localhost',
    port: 6379 // default
  }
})

// Set user info from request
function setUserInfo(request) {
    return {
        _id: request._id,
        profile: request.profile,
        personalInfo: request.personalInfo,
        education: request.education,
        work_experience: request.work_experience,
        tech_experience: request.tech_experience
    }
}

// Get Profile Route
exports.getProfile = function(req, res, next){
    var queryOptions = (req.body._id) ? { '_id': req.body._id } : { '_id': req.user._id }
    User.findOne(queryOptions, function(err, user){
        if (err) {
            res.send({ error: err})
            return next(err)
        }

        let userInfo = setUserInfo(user)

        res.status(200).json({ userInfo: userInfo })
    })
}

// Edit Profile
exports.editProfile = function(req, res, next){
    const image = req.body.image
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const user_type = req.body.user_type
    const location = req.body.location
    const remote_interest = req.body.remote_interest
    const remote_work = req.body.remote_work
    const email = req.body.email
    const phone = req.body.phone
    const linkedIn = req.body.linkedIn
    const github = req.body.github
    const degree = req.body.degree
    const branch = req.body.branch
    const university = req.body.university
    const eduStartAt = req.body.eduStartAt
    const eduEndAt = req.body.eduEndAt
    const position = req.body.position
    const company = req.body.company
    const workLocation = req.body.workLocation
    const workStartAt = req.body.workStartAt
    const workEndAt = req.body.workEndAt
    const years_of_experience = req.body.years_of_experience
    const tech_domains = req.body.tech_domains
    const technologies = req.body.technologies

    User.findOne({_id: req.user._id}, function(err, user){
        if(err)
            return next(err)
        if(!user)
            return res.status(422).send({error: "No user exists with the provided _id!"})

        if(image)user.profile.image = image
        if(first_name)user.profile.first_name = first_name
        if(last_name)user.profile.last_name = last_name
        if(user_type)user.profile.user_type = user_type
        if(location)user.profile.location = location
        if(remote_interest)user.profile.remote_interest = remote_interest
        if(remote_work)user.profile.remote_work = remote_work
        if(email)user.personalInfo.email = email
        if(phone)user.personalInfo.phone = phone
        if(linkedIn)user.personalInfo.linkedIn = linkedIn
        if(github)user.personalInfo.github = github
        if(degree)user.education.degree = degree
        if(branch)user.education.branch = branch
        if(university)user.education.university = university
        if(eduStartAt)user.education.startAt = eduStartAt
        if(eduEndAt)user.education.endAt = eduEndAt
        if(position)user.work_experience.position = position
        if(company)user.work_experience.company = company
        if(workLocation)user.work_experience.location = workLocation
        if(workStartAt)user.work_experience.startAt = workStartAt
        if(workEndAt)user.work_experience.endAt = workEndAt
        if(years_of_experience)user.tech_experience.years_of_experience = years_of_experience
        if(tech_domains)user.tech_experience.tech_domains = tech_domains
        if(technologies)user.tech_experience.technologies = technologies

        user.save(function(err, user){
            if(err)
                return next(err)

            if(image){
                const thumbnailJob = queue.create('thumbnail', {
                      name: 'User',
                      url: user.profile.image,
                      _id: user._id
                })
                .removeOnComplete(true)
                .attempts(5)
                .backoff({delay: 60*1000, type:'exponential'})
                .save()

                thumbnailJob.on('failed', function(errorMessage){
                    console.log('Job failed')
                    let error = JSON.parse(errorMessage)
                    console.log(error)
                })

                console.log({success: 'Successfully assigned job to the worker'});
            }

            res.status(200).json(user)
        })

    })
}
