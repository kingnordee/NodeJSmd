const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {//SECOND ARGUMENT OF THE SCHEMA CALL
    timestamps: true
})

//MODEL TAKES (NAME OF COLLECTION, COLLECTION SCHEMA/BLUEPRINT
const Task = mongoose.model('Task', taskSchema)

module.exports = Task
