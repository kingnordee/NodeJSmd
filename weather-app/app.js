const request = require('postman-request')
const url = "http://api.weatherstack.com/current?access_key=" +
    "e005e4f7554e5b4fc85c748655bb53c4&units=f&query="

// request({url: url, json: true}, (error, response) => {
//     if(error){
//         console.log("Unable to connect to the internet!")
//     }else if(response.body.error){
//         console.log(response.body.error.info)
//     }else{
//         data = response.body;
//         console.log(`${data.current.temperature}degrees F, ${data.current.weather_descriptions[0]}`)
//     }
// })

const geoCodeUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    "Los%20Angeles.json?access_token=pk.eyJ1Ijoia2luZ25vcmQiLCJhIjoiY" +
    "2p1bjdwbWZwMTFoczRhbXBkMGVxcDhwdSJ9.DH1yvIEpng2KTVRM42x8cw&limit=1"

request({url: geoCodeUrl, json: true}, (error, response) => {
    if (error){
        console.log("Unable to connect to the internet!")
    }else if(!response.body.features || response.body.features.length<1){
        console.log("Please enter a valid query")
    }else{
        // console.log(response.body.features)
        const longitude = response.body.features[0].center[0]
        const latitude = response.body.features[0].center[1]
        console.log([longitude, latitude])
    }
})
