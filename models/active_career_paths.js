const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CareerTrack = require('./career_track'),
    User = require('./user')

const ActiveCareerPathSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: User},
    career_track: {type: Schema.Types.ObjectId, ref: CareerTrack, required: true}
})

module.exports = mongoose.model('ActiveCareerPath', ActiveCareerPathSchema)
