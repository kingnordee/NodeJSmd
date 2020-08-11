//CRUD OPS
// const mongodb = require('mongodb')//importing the driver installed via npm
// const MongoClient = mongodb.MongoClient//necessary for connecting to db
// const ObjectID = mongodb.ObjectID//Below is same as these

const {MongoClient, ObjectID} = require('mongodb')//DeStructured

const id = new ObjectID()

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database: ' + error)
    }
    const db = client.db(databaseName)

    db.collection('tasks').findOne({
        description: 'Pot plants'
    }).then(result => {
        console.log(result)
    }).catch(error => console.log(error))
})
