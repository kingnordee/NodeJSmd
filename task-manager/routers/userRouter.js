const express = require('express')
const bcrypt = require('bcryptjs')
const router = new express.Router()
const User = require('../db/models/userModel')

router.post('/user', async (req, res) => {
    try{
        // req.body.password = await bcrypt.hash(req.body.password, 8)
        const result = await new User(req.body).save()
        res.status(201).send(result)
    }catch (error){ res.status(400).send(error) }
})

router.post('/user/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    }catch (e) {
        res.status(400).send(`${e}`)
    }
})

router.get('/users', async (req, res) => {//GET ALL USERS
    try{
        const users = await User.find({})
        if(users.length < 1) return res.status(404).send("No users found")
        res.send(users)
    }catch (error){ res.status(500).send(error) }
})//FETCH ALL USERS

router.get('/user/:id', async (req, res) => {//GET USER BY ID
    try{
        const user = await User.findById(req.params.id)
        if(!user) return res.status(404).send('User not found')
        res.send(user)
    }catch (error){ res.status(500).send(error) }
})//FIND USER BY ID

router.patch('/user/:id', async (req, res) => {
    const bodyKeys = Object.keys(req.body)
    const validKeys = ['name', 'age', 'password', 'email']
    const isValid = bodyKeys.every(key => validKeys.includes(key))
    if(!isValid) return res.status(400).send({updateError: "Invalid update attempt"})//Handling attempt to update a non-existing key
    try{
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidate: true})
        const user = await User.findById(req.params.id)
        bodyKeys.forEach(key => user[key] = req.body[key])
        await user.save()//above changes to support mongoose middleware
        //since the mongoose middleware listens for .save() event
        if(!user) return res.status(404).send("User not found!")
        res.send(user)
    }catch (e) { res.status(500).send(e) }
})//END OF PATCH USER

router.delete('/user/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).send('User not found!')
        res.send(`"${user.name}" successfully deleted!`)
    }catch (e) { res.status(404).send(e) }
})

module.exports = router
