const mongoose = require('mongoose'),
    validator = require('./../utils/validators'),
    Schema = mongoose.Schema,
    Section = require('./section').Section

const SuperQuizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    sections: [{
      _id: false,
      section: {type: Schema.Types.ObjectId, ref: Section},
      count: {type: Number, required: true}
    }]
})

module.exports = mongoose.model('SuperQuiz', SuperQuizSchema)
