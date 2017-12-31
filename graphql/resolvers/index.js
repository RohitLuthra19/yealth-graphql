const mongoose = require('mongoose');
const Order = require('../../models/order.model');
const SendOtp = require('sendotp');
const Constants = require('../../helpers/constants');
const sendOtp = new SendOtp(process.env.AUTHKEY_MSG91);

const resolver = {
    Query: {
        /**
         * Orders
         */
        getAllOrders: async (parent, args) => {
            return await Order.find({}, (err, res) => {
                return res;
            });
        },
        getOrder: async (parent, args) => {
            return await Order.findById(args._id);
        },
        getOrdersByUser: async (parent, args) => {
            return await Order.find({ orderBy: args.userId });
        }

        /**
         * Users
         */
        

    },
    Mutation: {
        /**
         * Orders
         */
        placeOrder: async (parent, args) => {
            const order = new Order(args);
            return await order.save();
        },
        updateOrder: async (parent, args) => {
            return await Order.findOneAndUpdate({ _id: args._id });
        },
        removeOrder: async (parent, args) => {
            return await Order.findByIdAndRemove({ _id: args._id });
        },
        updateOrderStatus: async (parent, { _id, ...doc }) => {
            await Order.update({ _id }, doc);
            return { _id, ...doc }
        },

        /**
         * Users
         */
        sendOtp: async (parent, args) => {
            var otp = Math.floor(Math.random() * 8999) + 1000;
            await sendOtp.send(args.mobileNumber, Constants.SENDER_ID, otp, (error, data, response) => {
                if (error) {
                    return next(error)
                } else if (data.type === "success") {
                    return true;
                }
            });
        },

    }
}
module.exports = resolver;