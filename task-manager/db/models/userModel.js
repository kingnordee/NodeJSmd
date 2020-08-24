const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/taskModel')

const userSchema = new mongoose.Schema({//START OF userSCHEMA*********START OF userSCHEMA**********
    name: {
        type: String, required: true, trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0)
                throw new Error('Age must be a positive integer')
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Email is invalid')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password"))
                throw new Error('Invalid password')
        }
    },
    //Token is an array of token objects, and each object follows the bluePrint defined below
    //so tokens for different devices of the same user could be conca'ted like:
    //tokens.concat({new token})
    tokens: [{//tokens are not required but token is. Meaning u can't concat an empty object to tokens
        token: { type: String, require: true }
    }],
    avatar: { type: Buffer }
}, {//SECOND ARGUMENT TO mongoose.Schema
    timestamps: true
})//END OF userSCHEMA****************END OF userSCHEMA***********************END OF userSCHEMA********


// ******************************METHODS******************************
//MONGOOSE MIDDLEWARE – RUNS THIS CODE EACH TIME .SAVE() IS CALLED IN ANY ROUTE
//SPECIFICALLY FOR POST USER AND PATCH USER to hash the password if not already hashed
userSchema.pre('save', async function (next){
    if(this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)
    next()
})//HASH THE USER'S PASSWORD BEFORE SAVING

//Authentication with username and password
//"statics" functions are accessible on the model
userSchema.statics.findByCredentials = async (email, password) => {//Only for login route
    const user = await User.findOne({ email })//{User.email == email
    if(!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('Unable to login')

    return user;
}

//Generating token for one specific user after it's created or found
//Hence userSchema.methods and not statics.
//"methods" functions are accessible on the instances.
userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_PUBLIC_KEY)//public key needed for signing and verifying
    this.tokens = this.tokens.concat({ token }); await this.save()
    return token
}//

//Return user's public only
//automatically excludes the deleted fields in this function
// when returning res.send in the routers
userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password;
    delete userObject.tokens
    delete userObject.avatar//It slows down loading
    return userObject
}

// ******************* User–>Task relationship ***************
userSchema.virtual('tasks', {
    ref: 'Task',//reference to the Task Model
    localField: '_id',//The field from User that is ref'd in Task
    foreignField: 'creator'//The field in Task that holds the localField(User._id)
})//Below is how you use this
// const user = await User.findById('5f395378ab5882b0abdaf618')
// await user.populate('tasks').execPopulate()
// console.log(user.tasks)

//Cascade delete all user tasks when a user is deleted.
userSchema.pre('remove', async function(next){
    await Task.deleteMany({creator: this._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
