const mongoose = require('mongoose'),
    validator = require('./../utils/validators'),
    Schema = mongoose.Schema

const BlogSchema = new Schema({
    name: String,
    link: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        }
    },
    objectives: [
        {
            goal: String,
            rank: Number
        }
    ]
})

module.exports = mongoose.model('Blog', BlogSchema)