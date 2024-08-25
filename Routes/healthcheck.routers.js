const express = require('express')
const customApiResponse = require('../utils/customApiResponse')

const HealthcheckRouter = express.Router()


HealthcheckRouter.route('/').get((req,res)=>{
    res.status(200).json(
        new customApiResponse(
            200,
            'Healthcheck router wroking successfully!',
        )
    )
})

module.exports = HealthcheckRouter