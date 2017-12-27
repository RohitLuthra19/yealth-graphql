var config = require('../config/config');
var Constants = require('./constants');
var msg91 = require("msg91")(config.authKeyMsg91, Constants.SENDER_ID, 4);
var FCM = require('fcm-push');
var fcm = new FCM(config.fcmServerKey);

const Common = {
    getToken: function (headers) {
        if (headers && headers.authorization) {
            return headers.authorization;
        }
        else {
            return null;
        }
    },
    sendSms: function (to, msg, next) {
        msg91.send(to, msg, function (err, response) {
            if (err) {
                return next(err);
            }
        });
    },
    sendNotifications: function (msg, next) {
        fcm.send(msg, function (err, response) {
            if (err) {
                return next(err);
            }
        });
    },

    /**
     * Function set title, body according to orderStatus
     * @param {*} orderStatus 
     */
    orderStatus: function (orderStatus) {
        var title = null;
        var body = null;
        switch (orderStatus) {
            case 0:
                title = "Order Availing";
                body = "Order Availing";
                break;
            case 1:
                title = "Order Confirmed";
                body = "Order Confirmed";
                break;
            case 2:
                title = "Order Available";
                body = "Order Available";
                break;
            case 3:
                title = "Order Placed";
                body = "Order Placed";
                break;
            case 4:
                title = "Order Deliverd";
                body = "Order Deliverd";
                break;
            case 5:
                title = "Order Canceled";
                body = "Order Canceled";
                break;
            default:
                title = "Alert from Yealth";
                body = "Something wrong with your order";
        }
        return {
            title: title,
            body: body
        };
    }

}

module.exports = Common;