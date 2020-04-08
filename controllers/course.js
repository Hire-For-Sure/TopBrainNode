"use strict"

const Course = require('./../models/course')

exports.getCourses = function(req, res, next){
    Course.find({...req.query}, function(err, courses){
        if(err)
            return next(err)
        return res.status(200).json(courses)
    })
}

exports.addCourse = function(req, res, next){
    const name = req.body.name
    const link = req.body.link
    const objectives = req.body.objectives
    if(!name)
        return res.status(422).json({"error": "Name is required"})
    if(!link)
        return res.status(422).json({"error": "Link is required"})
    let course = new Course({
        name: name,
        link: link,
        objectives: objectives
    })
    course.save(function(err, course){
        if (err)
            return next(err)
        return res.status(201).json(course)
    })
}

exports.deleteCourse = function(req, res, next){
    const _id = req.body._id
    Course.findOneAndDelete({
        _id: _id
    }, function(err, course){
        if(err)return next(err)
        if(!course){
            return res.status(422).send({
                error: "No course exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}

exports.editCourse = function(req, res, next){
    const _id = req.body._id
    Course.findOne({_id: _id}, function(err, course){
        if(err)
            return next(err)
        if(!course)
            return res.status(422).send({error: "No course exists with the provided _id!"})
        const name = req.body.name
        const link = req.body.link
        const objectives = req.body.objectives
        if(name)course.name = name
        if(link)course.link = link
        if(objectives)course.objectives = objectives
        course.save(function(err, course){
            if(err)
                return next(err)
            return res.status(200).json(course)
        })
    })
}
