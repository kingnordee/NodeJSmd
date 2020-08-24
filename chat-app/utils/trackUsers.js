const users = []

//Clean the data
const trimLower = (elem) => elem.trim().toLowerCase()

const addUser = ({id, username, room}) => {
    // validate the data
    username = trimLower(username); room = trimLower(room)

    if(!username || !room)
        return {error: 'Username and room are required'}

    //Check for existing user
    const existingUser = users.find(user => {
        return user.username === username && user.room === room
    })

    //Validate username
    if(existingUser) return {error: 'Username is already in use'}

    //Store user (must pass all constraints above to get to this code
    const user = { id, username, room}
    users.push(user); return user
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if(index !== -1) return users.splice(index, 1)[0]
    return {error: 'User not found!'}
}

const getUser = (id) => {
    const user = users.find(found => found.id === id)
    if(!user) return {error: 'User not found'}
    return user
}

const getUsersInRoom = (room) => {
    room = trimLower(room)
    const usersInRoom = users.filter(user => user.room === room)
    if(usersInRoom.length < 1) return {error: 'No users in room'}
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
