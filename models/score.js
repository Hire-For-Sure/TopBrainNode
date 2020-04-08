const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('./user')
      Quiz = require('./quiz')
    
const ScoreSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: User},
    scores: [{
        _id: false,
        quiz: {type: Schema.Types.ObjectId, ref: Quiz},
        score: {
            type: Number,
            required: true
        }
    }]
})

module.exports = mongoose.model('Score', ScoreSchema)
