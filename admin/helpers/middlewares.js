var jwt = require('jsonwebtoken');
var Common = require('../../helpers/common');
var config = require('../config/config');

module.exports = {
    adminAppTokenParam: function (req, res, next) {
        var token = Common.getToken(req.headers);
        var decoded = null;
        if (token && token != null) {
            try {
                decoded = jwt.verify(token, config.adminJwtSecret);
                var email = decoded.email;

                if (!email || email == null) {
                    return res.send({ success: true, error: false, message: 'You are not a authorized user!' });
                }
                else {
                    req.params.email = decoded.email;
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
    adminAppTokenBody: function (req, res, next) {
        var token = Common.getToken(req.headers);
        var decoded = null;
        if (token && token != null) {
            try {
                decoded = jwt.verify(token, config.adminJwtSecret);
                var email = decoded.email;
                var userId = decoded.userId;

                if (!email || email == null && !userId || userId == null) {
                    return res.send({ success: true, error: false, message: 'You are not a authorized user!' });
                }
                else {
                    req.body.email = email;
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