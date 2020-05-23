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
        _id: false,
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
        },
        explaination: {
            type: String,
            required: true
        }
    }]
})

QuizSchema.path('questions').validate({
    isAsync : false,
    validator: function (questions) {
        questions.forEach(question => {
            if(question.choices.length!==4)return false;
        })
    },
    message: 'Each question must have 4 choices.'
})

module.exports = mongoose.model('Quiz', QuizSchema)
