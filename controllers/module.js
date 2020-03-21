"use strict";

const Module = require('./../models/module')

exports.getModules = function(req, res, next){
    Module.find(function(err, modules){
        if(err)
            return next(err)
        return res.status(200).json(modules)
    })
}

exports.addModule = function(req, res, next){
    const name = req.body.name
    const description = req.body.description
    const image = req.body.image
    const courses = req.body.courses
    const blogs = req.body.blogs
    const challenges = req.body.challenges
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
    let module = new Module({
        name: name,
        description: description,
        image: image,
        courses: courses,
        blogs: blogs,
        challenges: challenges
    })
    module.save(function(err, module){
        if(err)
            return next(err)
        return res.status(201).json(module)
    })
}

exports.deleteModule = function(req, res, next){
    const _id = req.body._id
    Module.findOneAndDelete({
        _id: _id
    }, function(err, module){
        if(err)return next(err)
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
        if(err)
            return next(err)
        if(!module)
            return res.status(422).send({error: "No module exists with the provided _id!"})
        const name = req.body.name
        const description = req.body.link
        const image = req.body.objectives
        const couress = req.body.courses
        const challenges = req.body.challenges
        const blogs = req.body.blogs
        if(name)module.name = name
        if(description)module.description = description
        if(image)module.image = image
        if(couress)module.couress = couress
        if(challenges)module.challenges = challenges
        if(blogs)module.blogs = blogs
        module.save(function(err, module){
            if(err)
                return next(err)
            return res.status(200).json(module)
        })
    })
}