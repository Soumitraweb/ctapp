const express = require('express');
const authController = require('../controllers/customer/authController');
const router = express.Router();

router.post('/login', authController.userLogin);
// router.post('/register', authController.userRegister);
// router.post('/forget-password', authController.userForgetPassword);
// router.post('/reset-password/:token', authController.userResetPassword);

module.exports = router;
