const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const morgan = require('morgan');
require('body-parser-xml')(bodyParser);

const db_login = {host: "dbhost",user: "dbuser",password: "dbpass",database: "dbip"}
const db = mysql.createConnection(db_login)

// Create db connection

db.connect((err) => {
    if(err){
        console.log(err)
    }
    console.log('Connected to database...')
})

// Function for keep db connection alive

function limitless(){
    let = "CALL Pet_Count()"
    db.query(let)
}

// Calling that function every 5 seconds
setInterval(limitless, 5000);

 
const app = express()

app.use(bodyParser.json())
app.use(morgan('tiny'))

module.exports.jwt = jwt
module.exports.db = db

// Import routes

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const petRoute = require('./routes/pets')
const adminRoute = require('./routes/admin')
const baseRoute = require('./routes/base')

// Use routes

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/pet', petRoute)
app.use('/api/admin', adminRoute)
app.use('/api/', baseRoute)

console.log(process.env.PORT)
if (process.env.PORT == undefined) {
    app.listen(3000, () => {
        console.log('Server Started...')
    })
}
else {
    app.listen(process.env.PORT, () => {
        console.log('Server Started...')
    })
}
