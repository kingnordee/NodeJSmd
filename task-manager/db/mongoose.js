//ALL THIS FILE DOES IS CONNECT MONGOOSE/DATABASE SERVER
const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/task-manager-api'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}
mongoose.connect(url, options)
