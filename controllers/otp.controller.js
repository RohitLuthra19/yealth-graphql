const SendOtp = require('sendotp');
var Constants = require('../helpers/constants');
var authController = require('../controllers/auth.controller');

const sendOtp = new SendOtp(process.env.AUTHKEY_MSG91);
//const sendOtp = new SendOtp(process.env.AUTHKEY_MSG91, 'Otp for your order is {{otp}}, please do not share it with anybody');
//sendOtp.setOtpExpiry('2');  // 2 minutes

/**
 * send otp
 * @property {number} req.params.mobileNumber - The mobileNumber of user.
 */
function send(req, res, next) {
    var recipient = req.params.mobileNumber;
    var otp = Math.floor(Math.random() * 8999) + 1000;

    sendOtp.send(recipient, Constants.SENDER_ID, otp, (error, data, response) => {
        if (error) {
            return next(error)
        } else if (data.type === "success") {
            res.json({ success: true, error: false, message: 'Otp sent successfully!' })
        } else {
            res.json({ success: false, error: false, message: 'Otp failed!' })
        }
    });

}

/**
 * verify otp
 * @property {number} req.params.mobileNumber - The mobileNumber of user.
 * @property {number} req.params.otp - The otp received by user.
 */
function verify(req, res, next) {
    var recipient = req.body.mobileNumber;
    var otp = req.body.otp;
    sendOtp.verify(recipient, otp, (error, data, response) => {
        if (error) {
            return next(error)
        } else if (data.type === "success") {
            authController.login(req, res, next);
        }
        else {
            res.json({ success: false, error: false, message: 'Otp does not verified!' })
        }

    });
}

/**
 * send otp
 * @property {number} req.params.mobileNumber - The mobileNumber of user.
 */
function resend(req, res, next) {
    send(req, res, next)
}

module.exports = { send, verify, resend };