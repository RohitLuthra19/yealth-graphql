var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var APIError = require('../../helpers/APIError');
var config = require('../config/config');
var AdminUser = require('../models/adminuser.model');

/**
 * Returns jwt token if valid name and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
    AdminUser.findOne({ email: req.body.email }, { __v: 0 }, function (err, user) {
        if (err) logger.error(err);

        if (!user) {
            res.send({ success: false, message: 'Login failed, User does not exists!' });
        }
        else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) {
                    res.json({ success: false, message: 'Error', error: err });
                }
                else {
                    if (isMatch && !err) {
                        AdminUser.findOneAndUpdate({ email: req.body.email },
                            {
                                deviceToken: req.body.deviceToken,
                                environment: req.body.environment,
                                osVersion: req.body.osVersion,
                                buildVersion: req.body.buildVersion,
                                device: req.body.device
                            }, function (err, user) {
                                if (err) logger.error(err);

                                if (!user) {
                                    res.json({ success: false, message: 'Login failed, User does not exists!', user: user });
                                }
                                else {
                                    // Modify user Object
                                    user.__v = undefined;
                                    user.password = undefined;
                                    user.save();

                                    const token = jwt.sign({
                                        email: user.email,
                                        userId: user._id
                                    }, config.adminJwtSecret);

                                    res.json({ success: true, message: 'Login successful', token: token, user: user });
                                }
                            });
                    }
                    else {
                        res.json({ success: false, message: 'Login failed, Password does not match!' });
                    }
                }
            });
        }
    });
}

function getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
        user: req.user,
        num: Math.random() * 100
    });
}

module.exports = { login, getRandomNumber };
