const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('./../utils/validators')

const CourseSchema = new Schema({
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
    objectives: [
        {
            goal: {type: String, required: true},
            rank: {type: Number, required: true}
        }
    ]
})

module.exports = mongoose.model('Course', CourseSchema)