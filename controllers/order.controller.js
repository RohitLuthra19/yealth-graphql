var jwt = require('jsonwebtoken');
var config = require('../config/config');
var APIError = require('../helpers/APIError');
var Common = require('../helpers/common');
var Order = require('../models/order.model');
var AdminUser = require("../admin/models/adminuser.model");

function placeOrder(req, res, next) {
    const order = new Order({
        orderStatus: req.body.orderStatus,
        orderBy: req.body.userId,
        orderAddress: req.body.orderAddress,
        prescription: req.body.prescription,
        medicines: req.body.medicines,
        createdAt: req.body.createdAt
    });

    order.save()
        .then(order => {
            return res.json({ success: true, error: false, message: 'Order placed successfully', order: order });
        })
        .catch(e => next(e));
}

function updateOrder(req, res, next) {
    Order.update({ _id: req.body.orderId },
        {
            orderStatus: req.body.orderStatus,
            orderBy: req.body.userId,
            medicines: req.body.medicines,
            orderAddress: req.body.orderAddress,
            vendorAssigned: req.body.vendorAssigned,
            prescription: req.body.prescription
        }, { new: true })
        .then(order => {
            return res.json({ success: true, error: false, message: 'Order updated successfully', order: order });
        })
        .catch(e => next(e));
}


/**
 * Get order list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {Order[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Order.list({ limit, skip })
        .then(orders => res.json({ success: true, error: false, message: 'Order returned successfully!', orders: orders }))
        .catch(e => next(e));
}

function get(req, res, next) {
    Order.findOne({ _id: req.params.orderId })
        .populate({ path: 'orderBy' })
        .populate({ path: 'vendorAssigned' })
        .then(order => {
            if (!order) {
                return res.status(403).send({ success: false, error: false, message: 'Order not found!' });
            }
            else {
                return res.json({ success: true, error: false, message: 'Order returned successfully!', order: order })
            }
        })
        .catch(e => next(e));
}

function getOrdersByUser(req, res, next) {
    Order.find({ orderBy: req.body.userId })
        .then(orders => {
            if (!orders) {
                return res.status(403).send({ success: false, error: false, message: 'Order not found!' });
            }
            else {
                return res.json({ success: true, error: false, message: 'Order returned successfully!', orders: orders })
            }
        })
        .catch(e => next(e));
}


function updateStatus(req, res, next) {
    var orderStatus = req.body.orderStatus;
    var orderId = req.body.orderId;
    Order.findOneAndUpdate({ _id: orderId }, {
        orderStatus: orderStatus
    })
        .populate({ path: 'orderBy' })
        .then(order => {
            if (!order) {
                return res.status(403).send({ success: false, error: false, message: 'Order not found!' });
            }
            else {

                var { title, body } = Common.orderStatus(orderStatus);

                AdminUser
                .find({})
                .then(adminUsers => {
                    adminUsers.forEach((user, index) =>{

                        if (user.deviceToken !== null || user.deviceToken !== '') {

                            var pushMessage = {
                                content_available: true,
                                to: user.deviceToken,
                                data: {
                                    title: title,
                                    body: body,
                                    orderId: orderId,
                                    orderStatus: orderStatus
                                }
                            };
        
                            Common.sendNotifications(pushMessage, next);
                        }
                    });

                    return res.json({ success: true, error: false, message: 'Order status updated and notification sent successfully!', order: order })

                })
                .catch(e => next(e));
            }
        })
        .catch(e => next(e));
}

module.exports = { placeOrder, updateOrder, list, get, getOrdersByUser, updateStatus };
