var express = require('express');
var validate = require('express-validation');
var otpController = require('../controllers/otp.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/send/:mobileNumber')
  .get(otpController.send)

router.route('/verify')
  .post(otpController.verify)

router.route('/:resend/:mobileNumber')
  .get(otpController.resend)

module.exports = router;
