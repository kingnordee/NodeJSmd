const express = require('express')
const router = new express.Router()
const Task = require('../db/models/taskModel')

router.post('/task', async (req, res) => {
    try{
        const result = await new Task(req.body).save()
        res.status(201).send(result)
    }catch (error){ res.status(400).send(error) }
})

router.get('/tasks', async (req, res) => {//GET ALL TASKS
    try{
        const tasks = await Task.find({})
        if(tasks.length < 1) return res.status(404).send("No tasks found")
        res.send(tasks)
    }catch (error){ res.status(500).send(error) }
})//FETCH ALL TASKS

router.get('/task/:id', async (req, res) => {//GET TASK BY ID
    try{
        const task = await Task.findById(req.params.id)
        if(!task) return res.status(404).send('Task not found')
        res.send(task)
    }catch (error){ res.status(500).send(error) }
})//FIND TASK BY ID

router.patch('/task/:id', async (req, res) => {
    const bodyKeys = Object.keys(req.body)
    const validKeys = ['description', 'completed']
    const isValid = bodyKeys.every(key => validKeys.includes(key))
    if(!isValid) return res.status(404).send({updateError: "Invalid update attempt"})
    try{
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidate: true})
        const task = await Task.findById(req.params.id)
        bodyKeys.forEach(key => task[key] = req.body[key])
        await task.save()
        if(!task) return res.status(404).send('Unable to complete request')
        res.send(task)
    }catch (e) { res.status(500).send({error: e}) }
})//END OF PATCH TASK

router.delete('/task/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task) return res.status(404).send('Task not found!')
        res.send(`The task "${task.description}" has been successfully deleted!`)
    }catch (e) { res.status(500).send(e) }
})

module.exports = router
