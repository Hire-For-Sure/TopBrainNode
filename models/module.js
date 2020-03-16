const mongoose = require('mongoose'),
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
        required: true
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

module.exports = mongoose.model('Moduele', ModuleSchema)