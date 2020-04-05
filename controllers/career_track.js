"use strict"

const CareerTrack = require('./../models/career_track'),
      kue = require('kue')

require('./../services/thumbnailworker')

let queue = kue.createQueue({
  prefix: 'q',
  redis: {
    host: 'localhost',
    port: 6379 // default
  }
})

exports.getCareerTracks = function(req, res, next) {
    CareerTrack.find(function(err, career_tracks){
        if (err)
            return next(err)
        return res.status(200).json(career_tracks)
    })
}

exports.editCareerTrack = function(req, res, next){
    const _id = req.params._id
    CareerTrack.findOne({_id: _id}, function(err, career_track){
        if(err)
            return next(err)
        if(!career_track)
            return res.status(422).send({error: "No career_track exists with the provided _id!"})
        return res.status(200).json(career_track)
    })
}

exports.addCareerTrack = function(req, res, next){
    const name = req.body.name
    const image = req.body.image
    const salary = req.body.salary
    const job_count = req.body.job_count
    const about = req.body.about
    const growth = req.body.growth
    const modules = req.body.modules
    const companies = req.body.companies
    const tags = req.body.tags
    if(!name)
        return res.status(422).json({error: "Name is required"})
    if(!image)
        return res.status(422).json({error: "Image is required"})
    if(!salary)
        return res.status(422).json({error: "Salary is required"})
    if(!job_count)
        return res.status(422).json({error: "Job count is required"})
    if(!about)
        return res.status(422).json({error: "About is required"})
    if(!growth)
        return res.status(422).json({error: "Growth is required"})
    let career_track = new CareerTrack({
        name: name,
        image: image,
        salary: salary,
        job_count: job_count,
        about: about,
        growth: growth,
        modules: modules,
        companies: companies,
        tags: tags
    })
    career_track.save(function(err, career_track){
        if(err)
            return next(err)
            
        const thumbnailJob = queue.create('thumbnail', {
              name: 'CareerTrack',
              url: career_track.image,
              _id: career_track._id
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
        
        return res.status(201).json(career_track)
    })
}

exports.deleteCareerTrack = function(req, res, next){
    const _id = req.params._id
    CareerTrack.findOneAndDelete({
        _id: _id
    }, function(err, career_track){
        if(err){return next(err)}
        if(!career_track){
            return res.status(422).send({
                error: "No career_track exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })   
    })
}

exports.editCareerTrack = function(req, res, next){
    const _id = req.params._id
    CareerTrack.findOne({_id: _id}, function(err, career_track){
        if(err)
            return next(err)
        if(!career_track)
            return res.status(422).send({error: "No career_track exists with the provided _id!"})
        const name = req.body.name
        const image = req.body.image
        const salary = req.body.salary
        const job_count = req.body.job_count
        const about = req.body.about
        const growth = req.body.growth
        const modules = req.body.modules
        const companies = req.body.companies
        if(name)career_track.name = name        
        if(image)career_track.image = image
        if(salary)career_track.salary = salary
        if(job_count)career_track.job_count = job_count
        if(about)career_track.about = about
        if(growth)career_track.growth = growth
        if(modules)career_track.modules = modules
        if(companies)career_track.companies = companies
        career_track.save(function(err, career_track){
            if(err)
                return next(err)
            res.status(200).json(career_track)
        })

    })
}

