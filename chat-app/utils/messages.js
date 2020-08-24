const generateMessage = (user, message) => {
    return {
        user,
        message,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (user, url) => {
    return {
        user,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}
