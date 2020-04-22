const mongoose = require('mongoose'),
    validator = require('./../utils/validators'),
    Schema = mongoose.Schema,
    Company = require('./company'),
    Module = require('./module')

const CareerTrackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        },
        required: true
    },
    thumbnailUrl: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        }
    },
    salary: {
        type: Number,
        required: true
    },
    job_count: {
        type: Number,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    growth: {
        type: mongoose.Types.Decimal128
    },
    modules: [
        {type: Schema.Types.ObjectId, ref: Module}
    ],
    companies: [
        {type: Schema.Types.ObjectId, ref: Company}
    ]
})

module.exports = mongoose.model('CareerTrack', CareerTrackSchema)
