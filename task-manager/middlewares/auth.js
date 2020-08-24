const jwt = require('jsonwebtoken')
const User = require('../db/models/userModel')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const verify = jwt.verify(token, process.env.JWT_PUBLIC_KEY)//public key needed for signing and verifying
        if(!verify) throw new Error('Auth verify error')

        const user = await User.findOne({_id: verify._id, 'tokens.token': token})//special mongoose way to check the array of tokens if any token === the token variable here.
        if(!user) throw new Error('Auth Error')

        req.token = token//This holds the token of the current device
        //so login out of mobile wouldn't log user out of other devices and vice versa
        req.user = user; next()
    }catch (e) {
        res.status(401).send(`${e}`)
    }
}

module.exports = auth
