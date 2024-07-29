const express = require('express')
const { RegisterAdmin, LogoutAdmin, LoginAdmin, changeUserPassword, ChangeAdminPassword, ChangeAdminEmail, ChangeAdminUsername } = require('../Controllers/admin.controllers')


const AdminRouter = express.Router()


AdminRouter.route('/login').post(LoginAdmin)
AdminRouter.route('/logout').get(LogoutAdmin)
AdminRouter.route('/register').post(RegisterAdmin)
AdminRouter.route('/change-password').post(ChangeAdminPassword)
AdminRouter.route('/change-email').post(ChangeAdminEmail) 
AdminRouter.route('/change-username').post(ChangeAdminUsername)




//Exporting the admin router


module.exports = AdminRouter