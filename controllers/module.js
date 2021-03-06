"use strict";

const Module = require('./../models/module'),
      kue = require('kue')

require('./../services/thumbnailworker')

let queue = kue.createQueue({
  prefix: 'q',
  redis: {
    host: 'localhost',
    port: 6379 // default
  }
})

exports.getModules = function(req, res, next){
    Module.find({...req.query}, function(err, modules){
        if (err) {
            return res.send({ error: err})
        }
        return res.status(200).json(modules)
    })
}

exports.addModule = function(req, res, next){
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    var courses = req.body.courses
    var blogs = req.body.blogs
    var challenges = req.body.challenges
    var tags = req.body.tags
    if(!name)
        return res.status(422).json({"error": "Name is required"})
    if(!description)
        return res.status(422).json({"error": "Description is required"})
    if(!image)
        return res.status(422).json({"error": "Image is required"})
    if(!courses)
        courses = []
    if(!blogs)
        blogs = []
    if(!challenges)
        challenges = []
    if(!tags)
        tags = []
    let module = new Module({
        name: name,
        description: description,
        image: image,
        courses: courses,
        blogs: blogs,
        challenges: challenges,
        tags: tags
    })
    module.save(function(err, module){
        if (err) {
            return res.send({ error: err})
        }

        const thumbnailJob = queue.create('thumbnail', {
              name: 'Module',
              url: module.image,
              _id: module._id
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

        return res.status(201).json(module)
    })
}

exports.deleteModule = function(req, res, next){
    const _id = req.body._id
    Module.findOneAndDelete({
        _id: _id
    }, function(err, module){
        if (err) {
            return res.send({ error: err})
        }
        if(!module){
            return res.status(422).send({
                error: "No Module exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}

exports.editModule = function(req, res, next){
    const _id = req.body._id
    Module.findOne({_id: _id}, function(err, module){
        if (err) {
            return res.send({ error: err})
        }
        if(!module)
            return res.status(422).send({error: "No module exists with the provided _id!"})
        const name = req.body.name
        const description = req.body.description
        const image = req.body.image
        const courses = req.body.courses
        const challenges = req.body.challenges
        const blogs = req.body.blogs
        const tags = req.body.tags
        if(name)module.name = name
        if(description)module.description = description
        if(image)module.image = image
        if(courses)module.courses = courses
        if(challenges)module.challenges = challenges
        if(blogs)module.blogs = blogs
        if(tags)module.tags = tags
        module.save(function(err, module){
            if (err) {
                return res.send({ error: err})
            }
            return res.status(200).json(module)
        })
    })
}

exports.getTags = function(req, res, next){
    var tagsSet = new Set()
    Module.find().select('tags').exec(function(err, modules){
        modules.forEach(function(module){
            module.tags.forEach(tag => tagsSet.add(tag))
        })

        let uniqueTags = [...tagsSet]
        res.status(200).json({
            tags: uniqueTags
        })
    })
}
