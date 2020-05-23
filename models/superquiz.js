const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Section = require('./section').Section

const SuperQuizSchema = new Schema({
    sections: [{
      _id: false,
      section: {type: Schema.Types.ObjectId, ref: Section},
      count: {type: Number, required: true}
    }]
})

module.exports = mongoose.model('SuperQuiz', SuperQuizSchema)
