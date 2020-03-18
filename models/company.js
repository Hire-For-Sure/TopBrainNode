const mongoose = require('mongoose'),
      Schema = mongoose.Schema
    
const CompanySchema = new Schema({
    image: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        },
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Company', CompanySchema)