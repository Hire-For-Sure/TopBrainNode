const mongoose = require('mongoose'),
      validator = require('./../utils/validators'),
      Schema = mongoose.Schema,
      User = require('./user')

const ResponseSchema = new Schema({
    question_id: {type: Schema.Types.ObjectId},
    response_text: {type: String},
    file: {
      type: String,
      validate: {
          validator: validator.urlValidator,
          message: props => `${props.value} is not a valid URL!`
      }
    }
})

const JobSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    company: {
        type: String,
        required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    skills: [{
      type: String
    }],
    nature: {
      type: String,
      required: true,
      enum: ['Remote', 'Full-time']
    },
    experienceLevel: {
      type: String
    },
    questions: [{
      type: String,
      required: true
    }],
    responses: [{
      user_id: {type: Schema.Types.ObjectId, ref: User},
      question_responses: [ResponseSchema]
    }]
})

module.exports = mongoose.model('Job', JobSchema)
