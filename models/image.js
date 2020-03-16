const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ImageSchema = new Schema({
    original: {data: Buffer, contentType: String},
    thumbnail: {data: Buffer, contentType: String}
})

module.exports = mongoose.model('Image', ImageSchema)