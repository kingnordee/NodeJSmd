const request = require('postman-request')

const getGeoCode = (city, callback) => {
    const geoCodeUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+encodeURIComponent(city)+".json?access_token=" +
        "pk.eyJ1Ijoia2luZ25vcmQiLCJhIjoiY2p1bjdwbWZwMTFoczRhbXBkMGVxcDhwdSJ9.DH1yvIEpng2KTVRM42x8cw&limit=1"
    request({url: geoCodeUrl, json: true}, (error, response) => {
        if(error){
            callback("Unable to connect to the internet!", undefined)
        }else if(!response.body.features || response.body.features.length<1){
            callback("Error! Unable to find location. Please try another search",undefined)
        }else{
            // console.log(response.body.features)
            callback(undefined, {
                lat: response.body.features[0].center[1],
                lon: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            })
        }
    })
}//GETS LAT AND LONG OF INPUT CITY(string) and passes it into the callback param

const getWeather = (lat, lon, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=e005e4f7554e5b4fc85c7" +
        "48655bb53c4&units=f&query="+encodeURIComponent(lat)+","+encodeURIComponent(lon)+""

    request({url: url, json: true}, (error, response) => {
        if(error){
            callback("Please check your query or connection and try again!", undefined)
        }else if(response.body.error){
            callback(response.body.error.info +" "+"Please check your input and try again", undefined)
        }else{
            callback(undefined, response)
        }
    })
}//TAKES THE INPUT LAT AND LON FROM getGeoCode and passes the weather of that location into its callback param


const forecast = (city, callback) => {
    getGeoCode(city, (err, res) => {
        if(err) return callback(err, undefined)
        getWeather(res.lat, res.lon, (error, response) => {
            if(error) return callback(error, undefined)
            else callback(undefined, {
                location: res.location,
                temperature: response.body.current.temperature+"-degrees F",
                description: response.body.current.weather_descriptions[0],
                icon: response.body.current.weather_icons[0]
            })
        })
    })
}

module.exports = {
    forecast: forecast
}
