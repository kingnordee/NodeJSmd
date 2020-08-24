const express = require('express')
const router = new express.Router()
const Task = require('../db/models/taskModel')
const User = require('../db/models/userModel')
const auth = require('../middlewares/auth')

const uncaughtError = (error, req, res, next) =>
    res.status(400).send(`Error: ${error.message}`)

router.post('/task', auth, async (req, res) => {
    try{
        req.body.creator = req.user._id
        const result = await new Task(req.body).save()
        res.status(201).send(result)
    }catch (error){ res.status(400).send(`${error}`) }
}, uncaughtError)

//GET ALL TASKS BY AUTHENTICATED USER (i.e: AUTHORIZATION)
//GET /tasks?completed=true
//GET /tasks?limit=10&skip=10
//GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {//GET ALL TASKS
    const match = {}; const sort = {}
    if(req.query.completed)
        match.completed = req.query.completed === 'true'
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        // const tasks = await Task.find({creator: req.user._id})// OR
        await req.user.populate({
            path: 'tasks',
            match,// i.e: match: the match defined above
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()//Mongoose special syntax from Schema.virtual
        if(req.user.tasks.length < 1) return res.status(404).send("Error: No tasks found")
        res.send(req.user.tasks)
    }catch (error){ res.status(500).send(`${error}`) }
}, uncaughtError)//FETCH ALL TASKS

router.get('/task/:id', auth, async (req, res) => {//GET TASK BY ID
    try{
        const task = await Task.findOne({ _id: req.params.id, creator: req.user._id })
        if(!task) return res.status(404).send('Error: Task not found')
        res.send(task)
    }catch (error){ res.status(500).send(`${error}`) }
}, uncaughtError)//FIND TASK BY ID

router.patch('/task/:id', auth, async (req, res) => {
    const bodyKeys = Object.keys(req.body)
    const validKeys = ['description', 'completed']
    const isValid = bodyKeys.every(key => validKeys.includes(key))
    if(!isValid) return res.status(404).send({updateError: "Error: Invalid update attempt"})
    try{
        const task = await Task.findOne({ _id: req.params.id, creator: req.user._id})
        if(!task) return res.status(404).send('Error: Task not found')
        bodyKeys.forEach(key => task[key] = req.body[key]); await task.save()
        res.send(task)
    }catch (e) { res.status(500).send(`${e}`) }
}, uncaughtError)//END OF PATCH TASK

router.delete('/task/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndRemove({_id: req.params.id, creator: req.user._id})
        if(!task) return res.status(404).send('Error: Task not found!')
        res.send(`The task "${task.description}" has been successfully deleted!`)
    }catch (e) { res.status(500).send(`${e}`) }
}, uncaughtError)

module.exports = router
