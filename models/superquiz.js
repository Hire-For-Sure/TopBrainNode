const mongoose = require('mongoose'),
    validator = require('./../utils/validators'),
    Schema = mongoose.Schema,
    Section = require('./section').Section,
    CareerTrack = require('./career_track')

const SuperQuizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    career_track: {type: Schema.Types.ObjectId, ref: CareerTrack},
    sections: [{
      _id: false,
      section: {type: Schema.Types.ObjectId, ref: Section},
      count: {type: Number, required: true}
    }]
})

module.exports = mongoose.model('SuperQuiz', SuperQuizSchema)
