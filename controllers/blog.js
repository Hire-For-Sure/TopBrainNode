"use strict"

const Blog = require('./../models/blog')

exports.getBlogs = function(req, res, next) {
    Blog.find({...req.query}, function(err, blogs){
        if (err) {
            return res.send({ error: err})
        }
        return res.status(200).json(blogs)
    })
}

exports.addBlog = function(req, res, next){
    const name = req.body.name
    const link = req.body.link
    var objectives = req.body.objectives
    if(!name)
        return res.status(422).json({error: "Name is required"})
    if(!link)
        return res.status(422).json({error: "Link is required"})
    if(!objectives)
        objectives = []
    let blog = new Blog({
        name: name,
        link: link,
        objectives: objectives
    })
    blog.save(function(err, blog){
        if (err) {
            return res.send({ error: err})
        }
        res.status(201).json({
            _id: blog._id
        })
    })
}

exports.deleteBlog = function(req, res, next){
    const _id = req.body._id
    Blog.findOneAndDelete({
        _id: _id
    }, function(err, blog){
        if (err) {
            return res.send({ error: err})
        }
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
    const _id = req.body._id
    Blog.findOne({_id: _id}, function(err, blog){
        if (err) {
            return res.send({ error: err})
        }
        if(!blog)
            return res.status(422).send({error: "No blog exists with the provided _id!"})
        const name = req.body.name
        const link = req.body.link
        const objectives = req.body.objectives
        if(name)blog.name = name
        if(link)blog.link = link
        if(objectives)blog.objectives = objectives
        blog.save(function(err, blog){
            if (err) {
                return res.send({ error: err})
            }
            res.status(200).json(blog)
        })

    })
}
