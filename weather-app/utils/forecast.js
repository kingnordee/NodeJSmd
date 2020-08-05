const request = require('postman-request')

const getGeoCode = (city, callback) => {
    const geoCodeUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+encodeURIComponent(city)+".json?access_token=" +
        "pk.eyJ1Ijoia2luZ25vcmQiLCJhIjoiY2p1bjdwbWZwMTFoczRhbXBkMGVxcDhwdSJ9.DH1yvIEpng2KTVRM42x8cw&limit=1"
    request({url: geoCodeUrl, json: true}, (error, response) => {
        if(error){
            callback("Unable to connect to the internet!")
        }else if(!response.body.features || response.body.features.length<1){
            callback("Error! Unable to find location. Please try another search")
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


const forecast = (city) => {
    getGeoCode(city, (error, response) => {
        if(error){
            console.log(error)
        }else{
            getWeather(response.lat, response.lon, (err, res) => {
                const data = res.body;
                console.log(response.location)
                console.log(`${data.current.temperature}-degrees F, ${data.current.weather_descriptions[0]}`)
            })
        }
    })
}//Combines both getGeoCode and getWeather by using


const weatherByCity = (city) => {
    getGeoCode(city, (error, data) => {
        if(error){
            console.log(error);
        }else{
            const url = "http://api.weatherstack.com/current?access_key=e005e4f7554e5b4fc85c7" +
                "48655bb53c4&units=f&query="+encodeURIComponent(data.lat)+","+encodeURIComponent(data.lon)+""
            request({url: url, json: true}, (error, response) => {
                if(error){
                    console.log("Please check your query or connection and try again!")
                }else if(response.body.error){
                    console.log(response.body.error.info +" "+"Please check your input and try again")
                }else{
                    const data2 = response.body;
                    console.log(data.location)
                    console.log(`${data2.current.temperature}degrees F, ${data2.current.weather_descriptions[0]}`)
                }
            })
        }
    })
}

module.exports = {
    forecast: forecast,
    geocode: getGeoCode,
    weather: getWeather,
    bycity: weatherByCity
}
