const path = require('path')
const express = require('express')
const hbs = require('hbs')
const utils = require('./public/js/utils/forecast')

const app = express()
const host = process.env.PORT || 3000

//setting up handlebars
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, '/views/partials'))
// app.set('views', path.join(__dirname, '/public/html'))//if .hbs files were in html folder

//Setup static directory to serve
app.use(express.static(path.join(__dirname, '/public')))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Homepage',
        name: 'King',
        age: 27,
        city: 'Buffalo'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About me",
        name: 'King'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpMessage: 'Help is on the way!',
        title: 'Help',
        name: 'King'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "You must provide an address to proceed!"
        })
    }
    utils.forecast(req.query.address, (error, data) => {
        if(error) return res.send({error})
        res.send({
            location: data.location,
            temperature: data.temperature,
            description: data.description,
            icon: data.icon
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 404,
        errorMessage: 'Help category not found',
        name: 'Kay-G'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: 404,
        errorMessage: "Page doesn't exist",
        name: 'Kay-G'
    })
})


app.listen(host, () => {
    console.log(`Server is running on port ${host}`)
})
