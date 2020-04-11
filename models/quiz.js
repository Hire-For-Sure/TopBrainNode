const mongoose = require('mongoose'),
      Schema = mongoose.Schema
    
const QuizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['E', 'M', 'H'],
        required: true
    },
    questions: [{
        text: {
            type: String,
            required: true
        },
        choices: [{
            type: String,
            required: true
        }],
        answer: {
            type: Number,
            required: true
        }
    }]
})

QuizSchema.path('questions').validate({
    isAsync : false,
    validator: function (questions) {
        return questions.choices.length === 4;
    },
    message: 'Each question must have 4 choices.'
})

module.exports = mongoose.model('Quiz', QuizSchema)
