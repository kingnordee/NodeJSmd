const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kaygey.nordee@gmail.com',
        subject: 'Welcome to Task App',
        text: `Hi ${name}, welcome to Task App!`
    }).then(res => console.log(`Success: ${res}`)).catch(e => console.log(`Error: ${e}`))
}

const sendPartingEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kaygey.nordee@gmail.com',
        subject: "We'll miss you at Task App",
        text: `Sorry to see you go, ${name}, we hope you come back soon!`
    }).catch(e => e)
}


module.exports = {
    sendWelcomeEmail,
    sendPartingEmail
}
