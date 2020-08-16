const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('./user'),
      SuperQuiz = require('./superquiz'),
      Section = require('./section').Section

const ScoreSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: User},
    scores: [{
        _id: false,
        superquiz: {type: Schema.Types.ObjectId, ref: SuperQuiz},
        section_score: [{
            _id: false,
            section: {type: Schema.Types.ObjectId, ref: Section},
            score: {type: Number, required: true},
            maxScore: {type: Number}
        }],
        createdAt: {type: Date, default: Date.now()}
    }]
})

module.exports = mongoose.model('Score', ScoreSchema)
