var jwt = require('jsonwebtoken');
var Common = require('../helpers/common');
var config = require('../config/config');

module.exports = {
    appTokenParam: function (req, res, next) {
        var token = Common.getToken(req.headers);
        var decoded = null;
        if (token && token != null) {
            try {
                decoded = jwt.verify(token, config.jwtSecret);
                var mobileNumber = decoded.mobileNumber;

                if (!mobileNumber || mobileNumber == null) {
                    return res.send({ success: true, error: false, message: 'You are not a authorized user!' });
                }
                else {
                    req.params.mobileNumber = decoded.mobileNumber;
                    next();
                }
            }
            catch (error) {
                res.json({ success: false, error: false, message: 'Authorization token is invalid!' });
            }
        }
        else {
            res.json({ success: false, error: false, message: 'Authorization token is not specified!' });
        }
    },
    appTokenBody: function (req, res, next) {
        var token = Common.getToken(req.headers);
        var decoded = null;
        if (token && token != null) {
            try {
                decoded = jwt.verify(token, config.jwtSecret);
                var mobileNumber = decoded.mobileNumber;
                var userId = decoded.userId;
                
                if (!mobileNumber || mobileNumber == null && !userId || userId == null) {
                    return res.send({ success: true, error: false, message: 'You are not a authorized user!' });
                }
                else {
                    req.body.mobileNumber = mobileNumber;
                    req.body.userId = userId;
                    
                    next();
                }
            }
            catch (error) {
                res.json({ success: false, error: false, message: 'Authorization token is invalid!' });
            }
        }
        else {
            res.json({ success: false, error: false, message: 'Authorization token is not specified!' });
        }
    }
}