const express = require('express')
const authController = require('./../Controllers/authController')


const router = express.Router()


router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgetPassword);
router.route('/resetPassword/:Token').patch(authController.resetPassword);

module.exports = router;