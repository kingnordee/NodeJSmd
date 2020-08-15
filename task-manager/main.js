const express = require('express')
require('./db/mongoose')//Just so mongoose.js runs to connect mongoose to the localhost/port
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())//automatically parses incoming json (into a JS object)
app.use(userRouter)
app.use(taskRouter)

// app.post('/user', (req, res) => {
//     new User(req.body).save()
//         .then(result => {
//             res.status(201).send(result)
//     }).catch(error => {
//         res.status(400).send(error)
//     })
// })

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const password = 'pricelessKing'
    const hashed = await bcrypt.hash(password, 8)
    console.log("Hashed: " + hashed)

    const isMatch = await bcrypt.compare(password, hashed)
    console.log(isMatch)
}

// myFunction()




