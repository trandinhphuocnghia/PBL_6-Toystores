const router = require('express').Router()
const UserController = require('../Controller/Usercontroller')
const authCustomer = require('../Middlewares/authCustomer')

//user's route
router.post('/register', UserController.register)
router.get('/refresh_token',UserController.refreshToken)
router.post('/login',UserController.login)
router.get('/logout',UserController.logout)
router.get('/infor',authCustomer,UserController.getCustomerinfo)

module.exports = router