const express = require('express')
require('./db/mongoose')//Just so mongoose.js runs to connect mongoose to the localhost/port
const User = require('./db/models/userModel')
const Task = require('./db/models/taskModel')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())//automatically parses incoming json (into a JS object)

// app.post('/user', (req, res) => {
//     new User(req.body).save()
//         .then(result => {
//             res.status(201).send(result)
//     }).catch(error => {
//         res.status(400).send(error)
//     })
// })

app.post('/user', async (req, res) => {
    try{
        const result = await new User(req.body).save()
        res.status(201).send(result)
    }catch (error){ res.status(400).send(error) }
})

app.post('/task', (req, res) => {
    new Task(req.body).save()
        .then(result => {
            res.status(201).send(result)
        }).catch(error => {
            res.status(400).send(error)
    })
})

app.get('/users', (req, res) => {//GET ALL USERS
    User.find({}).then(users => {
        if(users.length<1)
            return res.status(404).send("No users found")
        res.send(users)
    }).catch(error => res.status(500).send(`${error}`))
})//FETCH ALL USERS

app.get('/users/:id', (req, res) => {//GET USER BY ID
    User.findById(req.params.id).then(user => {
        if(!user) return res.status(404).send('User not found')
        res.send(user)
    }).catch(error => res.status(500).send(`${error}`))
})//FIND USER BY ID

app.get('/tasks', (req, res) => {//GET ALL TASKS
    Task.find({}).then(tasks => {
        if(tasks.length<1)
            return res.status(404).send("No tasks found")
        res.send(tasks)
    }).catch(error => res.status(500).send(`${error}`))
})//FETCH ALL TASKS

app.get('/tasks/:id', (req, res) => {//GET TASK BY ID
    User.findById(req.params.id).then(task => {
        if(!task)
            return res.status(404).send('Task not found')
        res.send(task)
    }).catch(error => res.status(500).send(`${error}`))
})//FIND TASK BY ID

app.listen(port, () => {
    console.log(`Server listen on port: ${port}`)
})




