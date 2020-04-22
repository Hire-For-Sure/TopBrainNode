"use strict"

const CompletedModule = require('./../models/completed_modules')

exports.getCompletedModules = function(req, res, next){
    const user = req.user._id
    CompletedModule.find({
        user: user
    }, function(err, completed_modules){
        if(err)
            return next(err)
        return res.status(200).json(completed_modules)
    })
}

exports.addCompletedModule = function(req, res, next){
    const module_id = req.body.module_id
    let completed_module = new CompletedModule({
        user: req.user._id,
        module: module_id
    })
    completed_module.save(function(err, completed_module){
        if(err)
            return next(err)
        res.status(201).json(completed_module)
    })
}

exports.markAsComplete = function(req, res, next){
    const module_id = req.body.module_id
    CompletedModule.findOne({ user: req.user._id, module: module_id }, function(err, completed_module){
        if(err)
            return next(err)
        completed_module.status = true
        completed_module.save(function(err, completed_module){
            if(err)
                return next(err)
            res.status(200).json(completed_module)
        })
    })
}
