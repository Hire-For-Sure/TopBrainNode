"use strict"

const CareerTrack = require('./../models/career_track'),
      kue = require('kue')


const { MongoClient } = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';
var collection;
MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
  console.log("Connected successfully to server");
  const db = client.db('sqill');
  collection = db.collection('careertracks');
});


require('./../services/thumbnailworker')

let queue = kue.createQueue({
  prefix: 'q',
  redis: {
    host: 'localhost',
    port: 6379 // default
  }
})

exports.getCareerTracks = function(req, res, next) {
    CareerTrack.find({...req.query}, function(err, career_tracks){
        if (err)
            return next(err)
        career_tracks.forEach(function(item, index){
            item = item.toObject()
            item.growth = item.growth.toString()
            this[index] = item
        }, career_tracks)
        return res.status(200).json(career_tracks)
    })
}

exports.addCareerTrack = function(req, res, next){
    const name = req.body.name
    const image = req.body.image
    const salary = req.body.salary
    const job_count = req.body.job_count
    const about = req.body.about
    const category = req.body.category
    const growth = req.body.growth
    const superquiz = req.body.superquiz
    var modules = req.body.modules
    var companies = req.body.companies
    if(!name)
        return res.status(422).json({error: "Name is required"})
    if(!image)
        return res.status(422).json({error: "Image is required"})
    if(!salary)
        return res.status(422).json({error: "Salary is required"})
    if(!job_count)
        return res.status(422).json({error: "Job count is required"})
    if(!about)
        return res.status(422).json({error: "About is required"})
    if(!category)
        return res.status(422).json({error: "Category is required"})
    if(!growth)
        return res.status(422).json({error: "Growth is required"})
    if(!superquiz)
        return res.status(422).json({error: "Superquiz id is required"})
    if(!modules)
        modules = []
    if(!companies)
        companies = []

    collection.insertOne({
        name: name,
        image: image,
        salary: salary,
        job_count: job_count,
        about: about,
        category: category,
        growth: growth,
        superquiz: superquiz,
        modules: modules,
        companies: companies
    }, function(err, result){
        if(err)
            return next(err)

        const career_track = result.ops[0];

        const thumbnailJob = queue.create('thumbnail', {
              name: 'CareerTrack',
              url: career_track.image,
              _id: career_track._id
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

        return res.status(201).json(career_track)
    })
}

exports.deleteCareerTrack = function(req, res, next){
    const _id = req.body._id
    CareerTrack.findOneAndDelete({
        _id: _id
    }, function(err, career_track){
        if(err){return next(err)}
        if(!career_track){
            return res.status(422).send({
                error: "No career_track exists with the provided _id!"
            })
        }
        return res.status(200).json({
            status: "SUCCESS"
        })
    })
}

exports.editCareerTrack = function(req, res, next){
    var objForUpdate = {};
    if(req.body.name)objForUpdate.name = req.body.name
    if(req.body.image)objForUpdate.image = req.body.image
    if(req.body.salary)objForUpdate.salary = req.body.salary
    if(req.body.job_count)objForUpdate.job_count = req.body.job_count
    if(req.body.about)objForUpdate.about = req.body.about
    if(req.body.category)objForUpdate.category = req.body.category
    if(req.body.growth)objForUpdate.growth = req.body.growth
    if(req.body.superquiz)objForUpdate.superquiz = req.body.superquiz
    if(req.body.modules)objForUpdate.modules = req.body.modules
    if(req.body.companies)objForUpdate.companies = req.body.companies
    objForUpdate = { $set: objForUpdate }
    collection.findOneAndUpdate({ _id:ObjectID(req.body._id) }, objForUpdate, { returnOriginal: false }, function(err, result){
        if(err)
            return next(err)
        res.status(200).json(result.value)
    })
}

exports.getCategories = function(req, res, next){
    CareerTrack.find().select('category').exec(function(err, categories){
        res.status(200).json({
            categories: categories
        })
    })
}
