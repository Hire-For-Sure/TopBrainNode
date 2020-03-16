const mongoose = require('mongoose'),
    validator = require('./../utils/validators'),
    Schema = mongoose.Schema

const ChallengeSchema = new Schema({
    name: String,
    link: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        }
    },
    points: Number
})

module.exports = mongoose.model('Challenge', ChallengeSchema)