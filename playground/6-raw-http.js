const http = require('http')

const url = "http://api.weatherstack.com/current?access_key=e005e4f7554e5b4fc85c7" +
    "48655bb53c4&units=f&query=-75,45"

const request = http.request(url,(res) => {
    let data = ''
    res.on('data', (chunk) => {
        data += chunk
    })

    res.on('end', () => {
        const body = JSON.parse(data)
        console.log(body)
    })
})

request.on('error', (error) => {
    console.log('http request ' + error)
})

request.end()
