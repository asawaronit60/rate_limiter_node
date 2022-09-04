const authController = require('../controller/authController')
const userController = require('../controller/userController')
const router = require('express').Router()

router.get('/getAllUsers',userController.getAllUsers)
router.post('/signup' , authController.signup)
router.patch('/updateUser/:userId',userController.updateUser)
router.get('/me',authController.geyMyDetails)

module.exports  = router