"use strict"

const Blog = require('./../models/blog')

exports.getBlogs = function(req, res, next) {
    Blog.find(function(err, blogs){
        if (err)
            return next(err)
        return res.status(200).json(blogs)
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

}

exports.editBlog = function(req, res, next){

}