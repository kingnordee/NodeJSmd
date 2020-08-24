const socket = io()

//Elements
const $messageForm = document.querySelector('#actualForm')
const $messageFormInput = $messageForm.querySelector('#formInput')
const $messageFormButton = $messageForm.querySelector('#sendButton')
const $sendLocation = document.querySelector('#sendLocation')
const $messagesPane = document.querySelector('#messageDisplay')

//MAINTAINING FOCUS
$messageFormInput.focus()
document.querySelector('body').addEventListener('click', () => {
    $messageFormInput.focus()
})

//LISTENING FOR EVENTS FROM BACK-END
socket.on('connected', (welcome) => console.log(welcome.message, welcome.createdAt))
socket.on('disconnected', (goodbye) => console.log(goodbye.message, goodbye.createdAt))

socket.on('message', (packet) => {
    //EVERYTHING HERE IS EMITTED TO OTHER'S EXCEPT SELF
    const msgNode = document.createElement('p')
    msgNode.classList.add('receiving')
    msgNode.textContent = `${packet.user.username.toUpperCase()}${packet.message} ${moment(packet.createdAt).format('h:mm a')}`
    $messagesPane.appendChild(msgNode)
    $messagesPane.scrollTop = $messagesPane.scrollHeight
})

socket.on('location', (packet) => {
    //EVERYTHING HERE IS EMITTED TO OTHER'S EXCEPT SELF
    const header = document.createElement('p')
    header.textContent = `${packet.user.username.toUpperCase()} ${moment(packet.createdAt).format('h:mm a')}`
    header.classList.add('header')
    $messagesPane.appendChild(header)
    const msgNode = document.createElement('a')
    msgNode.setAttribute('href', packet.url)
    msgNode.setAttribute('target', '_blank')
    msgNode.classList.add('location')
    msgNode.textContent = 'My current location'
    $messagesPane.appendChild(msgNode)
    $messagesPane.scrollTop = $messagesPane.scrollHeight
})


//LISTENING FOR FRONT END REQUESTS WITH INNER EMISSIONS TO BACK-END
$messageForm.addEventListener('submit', (e) => {
        //EVERY MESSAGE OR OUTPUT HERE IS ONLY TO SELF
        e.preventDefault()
        $messageFormButton.setAttribute('disabled', 'disabled')

        // const message = e.target.elements.msg.value
        const message = $messageFormInput.value
        // (message, (dirty, clean)) => {} //blueprint of below params
        socket.emit('sendMessage', message, (dirty, clean) => {//Call back waits for response from main.js

            $messageFormButton.removeAttribute('disabled')
            $messageFormInput.value = ''
            $messageFormInput.focus()

            if(dirty) return console.log(dirty)
            //RENDERING
            const msgNode = document.createElement('p')
            msgNode.classList.add('sending')
            msgNode.textContent = `${clean.message} ${moment(clean.createdAt).format('h:mm a')}`
            $messagesPane.appendChild(msgNode)
            $messagesPane.scrollTop = $messagesPane.scrollHeight
            console.log(clean.message)
        })
    })

$sendLocation.addEventListener('click', () => {
        if(!navigator.geolocation) return alert('Geolocation not supported')

        $sendLocation.setAttribute('disabled', 'disabled')
        $sendLocation.setAttribute('style', 'background:slategray')
        $sendLocation.setAttribute('style', 'cursor: not-allowed')

        navigator.geolocation.getCurrentPosition(position => {
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, (acknowledgement) => {
                console.log(acknowledgement)
                $sendLocation.removeAttribute('disabled')
                $sendLocation.removeAttribute('style')
            })
        })
    })//END OF ADD EVENT LISTENER

//OPTIONS OPTIONS OPTIONS OPTIONS OPTIONS OPTIONS OPTIONS OPTIONS OPTIONS OPTIONS
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })
socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
