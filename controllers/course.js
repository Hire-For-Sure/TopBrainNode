"use strict"

const Course = require('./../models/course')

exports.getCourses = function(req, res, next){
    Course.find(function(err, courses){
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