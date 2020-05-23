const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Module = require('./module')

const QuestionSchema = new Schema({
    question: {
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
})

const SectionSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    questions: [QuestionSchema],
    relevant_content: [
      {type: Schema.Types.ObjectId, ref: Module, required: true}
    ]
})

SectionSchema.path('questions').validate({
    isAsync : false,
    validator: function (questions) {
        questions.forEach(question => {
            if(question.choices.length!==4)return false;
        })
    },
    message: 'Each question must have 4 choices.'
})

module.exports = {
    Section: mongoose.model('Section', SectionSchema),
    Question: mongoose.model('Question', QuestionSchema)
}
