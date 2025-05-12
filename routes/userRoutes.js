const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.post('/forgotpassword',userController.forgotPassword);
router.post('/resetpassword',userController.resetpassword);

module.exports = router;