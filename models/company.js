const mongoose = require('mongoose'),
      Schema = mongoose.Schema
    
const CompanySchema = new Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Company', CompanySchema)