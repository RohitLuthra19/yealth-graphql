const mongoose = require('mongoose');
const Order = require('../../models/order.model');

const resolver = {
    Query: {
        getAllOrders: async (parent, args) => {
            return await Order.find({}, (err, res) => {
                return res;
            });
        },
        getOrder: async (parent, args) => {
            return await Order.findById(args.orderId);
        },
    },
    Mutation: {
        placeOrder: async (parent, args) => {
            const order = new Order(args);
            return await order.save();
        }
    }
}
module.exports = resolver;