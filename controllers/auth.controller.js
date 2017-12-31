var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');
var User = require('../models/user.model');

/**
 * Returns jwt token if valid name and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
    var mobileNumber = req.body.mobileNumber;
    /* User.update({ mobileNumber: mobileNumber },
        {
            deviceToken: req.body.deviceToken,
            environment: req.body.environment,
            osVersion: req.body.osVersion,
            buildVersion: req.body.buildVersion,
            device: req.body.device
        }, { upsert: true, new: true })
        .then(user => {
            console.log(user);
            const token = jwt.sign({
                mobileNumber: user.mobileNumber,
                userId: user._id
            }, config.jwtSecret);
            return res.json({ success: true, error: false, message: 'Login successful', token: token, user: user });
        })
        .catch(e => next(e)); */
    var user = new User({
        mobileNumber: mobileNumber,
        deviceToken: req.body.deviceToken,
        environment: req.body.environment,
        osVersion: req.body.osVersion,
        buildVersion: req.body.buildVersion,
        device: req.body.device
    })

    user.save()
        .then(user => {
            if(mobileNumber.length >= 10){
                const token = jwt.sign({
                    mobileNumber: user.mobileNumber,
                    userId: user._id
                }, config.jwtSecret);
                return res.json({ success: true, error: false, message: 'Login successful', token: token, user: user });
            }
            else {
                return res.json({ success: false, error: false, message: 'Login failed! Invalid mobile Number' });
            }
        })
        .catch(e => next(e));
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
        user: req.user,
        num: Math.random() * 100
    });
}

module.exports = { login, getRandomNumber };
