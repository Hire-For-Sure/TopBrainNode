const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const CourseSchema = new Schema({
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

module.exports = mongoose.model('Course', CourseSchema)