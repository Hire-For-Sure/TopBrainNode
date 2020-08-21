const mongoose = require('mongoose'),
    validator = require('./../utils/validators'),
    Schema = mongoose.Schema

const ChallengeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        },
        required: true
    },
    fileUrl: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        }
    },
    points: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Challenge', ChallengeSchema)
