const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    Module = require('./module')

const CompletedModuleSchema = new Schema({
    module: {type: Schema.Types.ObjectId, ref: Module},
    user: {type: Schema.Types.ObjectId, ref: User},
    status: {type: Boolean, default: false}
})

module.exports = mongoose.model('CompletedModule', CompletedModuleSchema)
