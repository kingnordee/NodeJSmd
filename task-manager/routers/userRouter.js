const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const User = require('../db/models/userModel')
const auth = require('../middlewares/auth')
const {
    sendWelcomeEmail, sendPartingEmail
} = require('../sendEmails/sendEmail')//Using Destructuring

const upload = multer({
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/))
            return cb(new Error('Please upload a jpg, jpeg or png file'))
        cb(undefined, true)
    }
})

const uncaughtError = (error, req, res, next) =>
    res.status(400).send(`Error: ${error.message}`)


router.post('/user', async (req, res) => {
    try{
        let user = await User.findOne({ email: req.body.email })//Because "unique" field in schema not working
        if(user) return res.send('Email already in use')
        user = await new User(req.body)
        const token = await user.generateAuthToken(); //user.save()//only save if token was created successfully
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})
    }catch (error){ res.status(400).send(`${error}`) }
}, uncaughtError)//USER SIGN-UP

router.post('/user/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()//JWT to keep the found user logged in
        res.send({ user, token })//short hand for user: user, token: token.
    }catch (e) { res.status(400).send(`${e}`) }
}, uncaughtError)//USER LOGIN

router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try{//Make all images same format and resize before uploading
        req.user.avatar = await sharp(req.file.buffer).resize({
            width: 250, height: 250
        }).png().toBuffer(); await req.user.save()

        res.send('Avatar successfully uploaded!')
    }catch(e){ res.status(500).send(`${e}`) }
}, uncaughtError)//UPLOAD IMAGE

router.delete('/user/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined; await req.user.save()
        res.send('Avatar successfully deleted!')
    }catch(e){ res.status(500).send(`${e}`) }
}, uncaughtError)//DELETE IMAGE

router.get('/user/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) throw new Error('Unable to complete request')
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch (e) { res.status(500).send(`${e}`) }
}, uncaughtError)//FETCHING USER IMAGE

router.post('/user/logout', auth, async (req, res) => {
    try{//Removing the token they used to login in will log them out. (on that device)
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save(); res.send(`${req.user.name} has been successfully logged out`)
    }catch (e) { res.status(500).send(`${e}`) }
}, uncaughtError)//USER LOGOUT

router.post('/user/logoutall', auth, async (req, res) => {
    try{
        req.user.tokens = []; await req.user.save()
        res.send(`You have been successfully logged out of all devices`)
    }catch (e) { res.status(500).send(e) }
}, uncaughtError)

router.get('/user/me', auth, async (req, res) => {//GET ALL USERS
        res.send(req.user)
})//FETCH my page

router.patch('/user/me', auth, async (req, res) => {
    const bodyKeys = Object.keys(req.body)
    const validKeys = ['name', 'age', 'password', 'email']
    const isValid = bodyKeys.every(key => validKeys.includes(key))
    if(!isValid) return res.status(400).send({updateError: "Invalid update attempt"})//Handling attempt to update a non-existing key
    try{
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidate: true})
        bodyKeys.forEach(key => req.user[key] = req.body[key])
        await req.user.save()//above changes to support mongoose middleware
        //since the mongoose middleware listens for .save() event
        res.send(req.user)
    }catch (e) { res.status(500).send(`${e}`) }
}, uncaughtError)//END OF PATCH USER

router.delete('/user/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(`"${req.user.name}" successfully deleted!`)
        // sendPartingEmail(req.user.email, req.user.name)
    }catch (e) { res.status(404).send(e) }
}, uncaughtError)

module.exports = router
