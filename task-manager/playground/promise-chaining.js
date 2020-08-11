require('../db/mongoose')
const Task = require('../db/models/taskModel')
const User = require('../db/models/userModel')

// Task.findByIdAndDelete('5f31dd7dc75fce32224ebb7b').then(removed => {
//     console.log(removed)
//     return Task.countDocuments({completed: false})
// }).then(incomplete => {
//     console.log(incomplete)
// }).catch(error => console.log("Error: " + error))

// User.findByIdAndUpdate('5f32dc2f0ce15a52ee0e675d', {age: 25}).then(user => {
//     console.log(user)
//     return User.countDocuments({age: 25})
// }).then(result => {
//     console.log(result)
// }).catch(error => console.log(error))

// const updateAgeAndCount = async (id, age) => {
//     //user's value will be awaiting the promise from findByIdAndUpdate
//     const user = await User.findByIdAndUpdate(id, {age})
//     const count = await User.countDocuments({age: 25})
//     return count
// }
//
// updateAgeAndCount('5f32dc2f0ce15a52ee0e675d', 27).then(count => {
//     console.log(count)
// }).catch(error => console.log(error))

const deleteAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    return await Task.countDocuments({completed: false})
}

deleteAndCount('5f3193e1cf3a022d03bf0101').then(count => {
    console.log(count)
}).catch(error => { console.log(error) })

