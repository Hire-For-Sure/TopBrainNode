"use strict"

const Blog = require('./../models/blog')

exports.getBlogs = function(req, res, next) {
    Blog.find(function(err, blogs){
        if (err)
            return next(err)
        return res.status(200).json(blogs)
    })
}

exports.getBlog = function(req, res, next) {
    const _id = req.params._id
    Blog.findOne({_id: _id}, function(err, blog){
        if(err)
            return next(err)
        if(!blog)
            return res.status(422).send({error: "No blog exists with the provided _id!"})
        return res.status(200).json(blog)
    })
}

exports.addBlog = function(req, res, next){
    const name = req.body.name
    const link = req.body.link
    const objectives = req.body.objectives
    let blog = new Blog({
        name: name,
        link: link,
        objectives: objectives
    })
    blog.save(function(err, blog){
        if(err)
            return next(err)
        res.status(201).json({
            _id: blog._id
        })
    })
}

exports.deleteBlog = function(req, res, next){
    const _id = req.params._id
    Blog.findOneAndDelete({
        _id: _id
    }, function(err, blog){
        if(err){return next(err)}
        if(!blog){
            return res.status(422).send({
                error: "No blog exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}

exports.editBlog = function(req, res, next){
    const _id = req.params._id
    Blog.findOne({_id: _id}, function(err, blog){
        if(err)
            return next(err)
        if(!blog)
            return res.status(422).send({error: "No blog exists with the provided _id!"})
        const name = req.body.name
        const link = req.body.link
        const objectives = req.body.objectives
        if(name)blog.name = name
        
        if(link)blog.link = link
        if(objectives)blog.objectives = objectives
        blog.save(function(err, blog){
            if(err)
                return next(err)
            res.status(200).json(blog)
        })

    })
}
