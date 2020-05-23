const mongoose = require('mongoose'),
      validator = require('./../utils/validators'),
      Schema = mongoose.Schema,
      User = require('./user')

const JobSchema = new Schema({
    title: {
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
      type: String,
      required: true
    }],
    nature: {
      type: String,
      required: true
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Moderate', 'Advanced'],
      required: true
    },
    time: {
      type: Number,
      required: true
    },
    questions: [{
      type: String,
      required: true
    }],
    responses: [{
      user_id: {type: Schema.Types.ObjectId, ref: User},
      question_responses: [{
        question_id: {type: Schema.Types.ObjectId},
        response_text: {type: String},
        file: {
          type: String,
          validate: {
              validator: validator.urlValidator,
              message: props => `${props.value} is not a valid URL!`
          }
        }
      }]
    }],
    active: {
      type: Boolean,
      default: true
    },
    user_type: {
      type: String,
      enum: ['Student', 'Professional'],
      required: true
    },
    attatchments: [{
      _id: false,
      type: String,
      validate: {
          validator: validator.urlValidator,
          message: props => `${props.value} is not a valid URL!`
      }
    }]
})

module.exports = mongoose.model('Job', JobSchema)
