require('dotenv').config
const express = require('express')
const cors = require('cors')
const HealthcheckRouter = require('./Routes/healthcheck.routers')
const app = express()
// app.use(express.static()) Static files to be serverd here!
app.use(express.json())

app.use('/',HealthcheckRouter)

const port = process.env.PORT ||5000
app.listen(port,()=>{
    console.log('Server is listening on port:',port)
})