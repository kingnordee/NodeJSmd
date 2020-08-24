const express = require('express')
require('./db/mongoose')//Just so mongoose.js runs to connect mongoose to the localhost/port
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     res.status(503).send('Site currenlty under maintenance')
// })

app.use(express.json())//automatically parses incoming json (into a JS object)
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})


