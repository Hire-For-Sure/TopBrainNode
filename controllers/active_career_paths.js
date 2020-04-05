"use strict"

const ActiveCareerPath = require('./../models/active_career_paths')

exports.getCareerPaths = function(req, res, next){
    const user = req.user._id
    ActiveCareerPath.find({
        user: user
    }, function(err, active_career_paths){
        if(err)
            return next(err)
        return res.status(200).json(active_career_paths)
    })
}

exports.addCareerPath = function(req, res, next){
    const career_track_id = req.body.career_track_id
    let active_career_path = new ActiveCareerPath({
        user: req.user._id,
        career_track: career_track_id
    })
    active_career_path.save(function(err, active_career_path){
        if(err)
            return next(err)
        res.status(201).json(active_career_path)
    })
}

exports.deleteCareerPath = function(req, res, next){
    const career_track_id = req.body.career_track_id
    ActiveCareerPath.findOneAndDelete({
        career_track: career_track_id,
        user: req.user._id
    }, function(err, active_career_path){
        if(err)
            return next(err)
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}
