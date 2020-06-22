const kue = require('kue'),
      fetch = require('node-fetch'),
      sharp = require('sharp'),
      request = require('request'),
      fs = require('fs'),
      CareerTrack = require('../models/career_track'),
      Company = require('../models/company'),
      Module = require('../models/module'),
      SuperQuiz = require('../models/superquiz'),
      User = require('../models/user'),
      config = require('../config/main')

let queue = kue.createQueue({
  redis: {
    host: 'localhost',
    port: 6379
  }
})

queue.process('thumbnail', 5, (job, done) => {
  uploadThumbnail(job, done)
})

const uploadThumbnail = (job, done) => {
  // Delegated to the external function to manage promises efficiently
  // job.data contains the data passed for the job execution
  const url = job.data.url
  const modelName = job.data.name
  const _id = job.data._id

  fetch(url)
  .then(res => res.buffer())
  .then(buffer => {
    let fileName = Date.now().toString()
    sharp(buffer).resize(100).toFile(fileName + '.jpg')
    .then(() => {
        var options = {
            'method': 'POST',
            'url': config.HOST_URI,
            'headers': {
            },
            formData: {
                'image': {
                    'value': fs.createReadStream(fileName + '.jpg'),
                    'options': {
                    'filename': 'output.jpg',
                    'contentType': null
                    }
                }
            }
        }
        request(options, function (error, response) {
            if (error) throw new Error(error)
            let thumbnailUrl = JSON.parse(response.body).imageUrl
            if(modelName == 'CareerTrack'){
                CareerTrack.findOne({ _id: _id }, function(err, career_track){
                    if(err)
                        return new Error(err)

                    if(thumbnailUrl)career_track.thumbnailUrl = thumbnailUrl

                    career_track.save(function(err, career_track){
                        if(err)
                            return new Error(err)
                        console.log("Successfully updated thumbnail Url")
                    })

                })
            }

            if(modelName == 'Company'){
                Company.findOne({ _id: _id }, function(err, company){
                    if(err)
                        return new Error(err)

                    if(thumbnailUrl)company.thumbnailUrl = thumbnailUrl

                    company.save(function(err, company){
                        if(err)
                            return new Error(err)
                        console.log("Successfully updated thumbnail Url")
                    })

                })
            }

            if(modelName == 'Module'){
                Module.findOne({ _id: _id }, function(err, module){
                    if(err)
                        return new Error(err)

                    if(thumbnailUrl)module.thumbnailUrl = thumbnailUrl

                    module.save(function(err, module){
                        if(err)
                            return new Error(err)
                        console.log("Successfully updated thumbnail Url")
                    })

                })
            }

            if(modelName == 'SuperQuiz'){
                SuperQuiz.findOne({ _id: _id }, function(err, superquiz){
                    if(err)
                        return new Error(err)

                    if(thumbnailUrl)superquiz.thumbnailUrl = thumbnailUrl

                    superquiz.save(function(err, superquiz){
                        if(err)
                            return new Error(err)
                        console.log("Successfully updated thumbnail Url")
                    })

                })
            }

            if(modelName == 'User'){
                User.findOne({ _id: _id }, function(err, user){
                    if(err)
                        return new Error(err)

                    if(thumbnailUrl)user.profile.thumbnailUrl = thumbnailUrl

                    user.save(function(err, user){
                        if(err)
                            return new Error(err)
                        console.log("Successfully updated thumbnail Url")
                    })

                })
            }
        })
    })
    .catch()
  })
  .then(() => {
    done()
  })
  .catch()
}
