//ALL THIS FILE DOES IS CONNECT MONGOOSE/DATABASE SERVER
const mongoose = require('mongoose')

const url = process.env.MONGOOSE_URL_DATABASENAME
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}
mongoose.connect(url, options)
