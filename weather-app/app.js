const forecast = require('./utils/forecast.js')

// forecast.forecast("Amherst")

const args = process.argv
if(args[2]){
    // forecast.geocode(args[2], (error, response ) => {
    //     if(error)
    //         console.log(error)
    //     else
    //         forecast.weather(response.lat, response.lon, (err, res) => {
    //             if(err)
    //                 console.log(err)
    //             else{
    //                 console.log(response.location)
    //                 console.log(`${res.body.current.temperature}-degrees F, ${res.body.current.weather_descriptions[0]}`)
    //             }
    //         })
    // })
    forecast.forecast(args[2])
}

forecast.bycity("Lagos")




