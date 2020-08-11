// console.log("Client side js loaded")

// fetch('http://puzzle.mead.io/puzzle').then((response) => {
//     response.json().then((data) => {
//         console.log(data)
//     })
// })

const para = document.querySelector('p')
const input = document.querySelector('input')
const form = document.querySelector('form')

// fetch('http://localhost:3000/weather?address=12what')
//     .then( response => {
//         response.json().then( data => {
//             if(data.error) para.innerHTML = data.error
//             else
//                 para.innerHTML = data.location + '<br>' +
//                     data.temperature + '<br>' + data.description
//         })
//     })

form.addEventListener('submit', (e) => {
    e.preventDefault()
    // if(!input.value) return para.innerHTML = "Please enter a valid input"
    para.innerHTML = `<i> Loading...</i>`
    fetch('/weather?address='+input.value)
        .then( response => {
            response.json().then( data => {
                if(data.error) para.innerHTML = data.error
                else{
                    para.innerHTML = data.location + '<br>' +
                        data.temperature + '<br>' + data.description
                }
            })
        })
})
