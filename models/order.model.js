var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var autoIncrement = require('mongoose-auto-increment');

/**
 * autoIncremented Order No for user collection
 */
var config = require('../config/config');
var connection = mongoose.createConnection(config.mongo.host);
autoIncrement.initialize(connection);

/**
 * Order Schema
 */
const OrderSchema = new mongoose.Schema({
    orderNo: {
        type: Number,
        required: true
    },
    orderAddress: {
        name: {
            type: String
        },
        houseNo: {
            type: String
        },
        landMark: {
            type: String
        },
        locality: {
            type: String
        },
        pincode: {
            type: String
        },
        mobileNumber: {
            type: String,
            match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
        },
        lat: {
            type: String
        },
        long: {
            type: String
        },
        default: {}
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    orderStatus: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5]
    },
    prescription: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    medicines: [{
        medicineName: {
            type: String
        },
        dosage: {
            type: String
        },
        units: {
            type: Number,
            enum: [0, 1, 2]
        },
        price: {
            type: Number
        },
        default: {}
    }],
    vendorAssigned: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Vendor'
    },

});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
OrderSchema.method({
});

/**
 * Statics
 */
OrderSchema.statics = {
    /**
     * Get Order
     * @param {ObjectId} id - The objectId of Order.
     * @returns {Promise<Order, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((Order) => {
                if (Order) {
                    return Order;
                }
                const err = new APIError('No such Order exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List Orders in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of Orders to be skipped.
     * @param {number} limit - Limit number of Orders to be returned.
     * @returns {Promise<Order[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .populate({ path: 'orderBy' })
            .populate({ path: 'vendorAssigned'})
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    }
};

OrderSchema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'orderNo',
    startAt: 100,
    incrementBy: 1
});

/**
 * @typedef Order
 */
module.exports = mongoose.model('Order', OrderSchema);