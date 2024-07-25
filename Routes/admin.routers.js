const express = require('express')


const AdminRouter = express.Router()


AdminRouter.route('/login')
AdminRouter.route('/logout')
AdminRouter.route('/register')
AdminRouter.route('/change-password') 
AdminRouter.route('/change-email') 
AdminRouter.route('/change-username') 




//Exporting the admin router


module.exports = AdminRouter