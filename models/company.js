const mongoose = require('mongoose'),
      Schema = mongoose.Schema
    
const CompanySchema = new Schema({
    image: {type: String},
    name: {type: String}
})

module.exports = mongoose.model('Company', CompanySchema)