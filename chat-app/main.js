const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/trackUsers')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))

app.use(express.json())//automatically parses incoming json (into a JS object)


//SOCKET OPERATIONS
io.on('connection', (socket) => {
    console.log('new io connection')
    // General: socket.emit, io.emit, socket.broadcast.emit
    // Chatroom: io.to.emit, socket.broadcast.to.emit
    socket.on('join', ({username, room}, callback) => {
        const user  = addUser({id: socket.id, username, room})

        if(user.error) return callback(user.error)

        socket.join(user.room)

        socket.emit('connected', generateMessage(user, 'Welcome'))//TO SELF
        socket.broadcast.to(user.room).emit('message', generateMessage(user, ' has joined!'))
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)) return callback('Error: profanity is not allowed!', undefined)//DIRTY, CLEAN

        socket.broadcast.to(user.room).emit('message', generateMessage(user, `: ${message}`))
        callback(undefined, generateMessage(user, message))
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        console.log(user)
        const loc = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
        socket.broadcast.emit('location', generateLocation(user, loc))

        callback(loc)
    })


    socket.on('disconnect', () => {
        const user  = removeUser(socket.id)
        if(user)
            io.to(user.room).emit('message', generateMessage(user, ' has left the room'))
    })
})

server.listen(port, () => {
    console.log(`Chat server listening on port: ${port}`)
})
