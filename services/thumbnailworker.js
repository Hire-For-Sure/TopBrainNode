const kue = require('kue'),
      fetch = require('node-fetch'),
      sharp = require('sharp'),
      request = require('request'),
      https = require('https'),
      fs = require('fs'),
      CareerTrack = require('../models/career_track'),
      Company = require('../models/company'),
      Module = require('../models/module'),
      config = require('../config/main')

let queue = kue.createQueue({
  redis: {
    host: 'localhost',
    port: 6379
  }
})

let thumbnailUrl = null

queue.process('thumbnail', 5, (job, done) => {
  uploadThumbnail(job, done);
})

const uploadThumbnail = (job, done) => {
  // Delegated to the external function to manage promises efficiently
  // job.data contains the data passed for the job execution
  const url = job.data.url
  const modelname = job.data.name
  const _id = job.data._id
  
  fetch(url)
  .then(res => res.buffer())
  .then(buffer => {
    sharp(buffer).resize(100).toFile('output.jpg').then(() => {
        var options = {
            'method': 'POST',
            'url': config.HOST_URI,
            'headers': {
            },
            formData: {
                'image': {
                    'value': fs.createReadStream('output.jpg'),
                    'options': {
                    'filename': 'output.jpg',
                    'contentType': null
                    }
                }
            },
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
        }
        request(options, function (error, response) { 
            if (error) throw new Error(error)
            thumbnailUrl = response.body.imageUrl
            if(modulename == 'Company') {
                Company.findOneAndUpdate({ _id: _id }, { thumbnailurl: thumbnailUrl })
            }
            
            if(modulename == 'Module') {
                Company.findOneAndUpdate({ _id: _id }, { thumbnailurl: thumbnailUrl })
            }
            
            if(modulename == 'CareerTrack') {
                CareerTrack.findOneAndUpdate({ _id: _id }, { thumbnailurl: thumbnailUrl })
            }
        })
    })
    .catch((err) => {
      return done(new Error(JSON.stringify(err)))
    })
  })
  .then(() => {
    done()
  })
  .catch((err) => {
    if(400<=err.status<=499){
      job.attempts(0 , () => {
        return done( new Error(JSON.stringify(err)))
      })
    }
    return done( new Error(JSON.stringify(err)))
  })
}
