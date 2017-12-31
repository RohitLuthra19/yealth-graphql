var jwt = require('jsonwebtoken');
var config = require('../config/config');
var APIError = require('../../helpers/APIError');
var Common = require('../../helpers/common');
var Order = require('../../models/order.model');

/**
 * Get order list.
 * @property {number} req.query.skip - Number of orders to be skipped.
 * @property {number} req.query.limit - Limit number of orders to be returned.
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

function updateStatus(req, res, next) {
    var orderStatus = req.body.orderStatus;
    var orderId = req.body.orderId;
    Order.findOneAndUpdate({ _id: orderId }, {
        orderStatus: orderStatus
    }, { new: true })
        .populate({ path: 'orderBy' })
        .then(order => {
            if (!order) {
                return res.status(403).send({ success: false, error: false, message: 'Order not found!' });
            }
            else {

                var { title, body } = Common.orderStatus(orderStatus);
                if (order.orderBy.deviceToken !== null || order.orderBy.deviceToken !== '') {

                    var pushMessage = {
                        content_available: true,
                        to: order.orderBy.deviceToken,
                        data: {
                            title: title,
                            body: body,
                            orderId: orderId,
                            orderStatus: orderStatus
                        }
                    };

                    Common.sendNotifications(pushMessage, next);

                    return res.json({ success: true, error: false, message: 'Order status updated and notification sent successfully!', order: order })
                }
                else {
                    return res.json({ success: true, error: false, message: 'Order status updated successfully!', order: order })
                }
            }
        })
        .catch(e => next(e));
}

function assign(req, res, next) {
    var vendorId = req.body.vendorId;
    var orderId = req.body.orderId;
    Order.findOneAndUpdate({ _id: orderId }, {
        vendorAssigned: vendorId
    }, { new: true })
        .populate({ path: 'orderBy' })
        .then(order => {
            if (!order) {
                return res.json({ success: false, error: false, message: 'Order not found!' });
            }
            else {
                return res.json({ success: true, error: false, message: 'Order assigned succesfully!', order: order });
            }
        })
        .catch(e => next(e));
}

function updateOrder(req, res, next) {
    Order.update({ _id: req.body.orderId },
        {
            orderAddress: req.body.orderAddress,
            prescription: req.body.prescription,
            medicines: req.body.medicines
        }, { new: true })
        .then(order => {
            return res.json({ success: true, error: false, message: 'Order updated successfully', order: order });
        })
        .catch(e => next(e));
}
module.exports = { list, get, updateStatus, assign, updateOrder };
