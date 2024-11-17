/**
 * @fileoverview Health Check Router Implementation
 * This module provides a simple health check endpoint to monitor API availability
 */

// Import required dependencies
const express = require('express')
const customApiResponse = require('../utils/customApiResponse')

// Initialize Express Router for health check endpoints
const HealthcheckRouter = express.Router()

/**
 * @route GET /
 * @description Health check endpoint to verify API operational status
 * @returns {Object} customApiResponse - Returns a standardized response object
 *                   with 200 status code and success message
 * @example
 * // Response format:
 * {
 *   status: 200,
 *   message: "Healthcheck router working successfully!"
 * }
 */
HealthcheckRouter.route('/').get((req,res)=>{
    res.status(200).json(
        new customApiResponse(
            200,
            'Healthcheck router wroking successfully!',
        )
    )
})

// Export the router for use in main application
module.exports = HealthcheckRouter