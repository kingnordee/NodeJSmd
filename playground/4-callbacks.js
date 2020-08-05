// setTimeout(() => {
//     console.log("Three seconds are up!")
// }, 2000)


// const geocode = (address, callback) => {
//     setTimeout(()=>{
//         const data = {
//             latitude: 0, longitude: 0
//         }
//         callback(data)
//     }, 2000)
// }

// geocode('Philadelphia', (data) => {
//     console.log(data)
// })

// geocode('Philadelphia', (data) => { console.log(data)})

const enter2 = (num, callback) => {
    if(num > 2 || num < 2) callback("Wrong num", undefined)
    else callback(undefined, {number: num, valid: true})
}

enter2(2, (err, res) => {
    if(err) console.log(err)
    else console.log(res.number, res.valid)
})


