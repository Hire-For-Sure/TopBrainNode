"use strict"

const Course = require('./../models/course')

exports.getCourses = function(req, res, next){
    Course.find(function(err, courses){
        if(err)
            return next(err)
        return res.status(200).json(courses)
    })
}

