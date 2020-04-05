const mongoose = require('mongoose'),
      validator = require('./../utils/validators'),
      Schema = mongoose.Schema
      Course = require('./course'),
      Blog = require('./blog'),
      Challenge = require('./challenge')
    
const ModuleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        },
        required: true
    },
    thumbnailurl: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        }
    },
    courses: [
        {type: Schema.Types.ObjectId, ref: Course}
    ],
    blogs: [
        {type: Schema.Types.ObjectId, ref: Blog}
    ],
    challenges: [
        {type: Schema.Types.ObjectId, ref: Challenge}
    ]
})

module.exports = mongoose.model('Module', ModuleSchema)
