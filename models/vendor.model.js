var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');

/**
 * Vendor Schema
 */
const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        shopNo: {
            type: String
        },
        landMark: {
            type: String
        },
        locality: {
            type: String
        },
        city: {
            type: String
        },
        pincode: {
            type: Number
        },
        lat: {
            type: Number
        },
        long: {
            type: Number
        },
        default: {}
    },
    mobileNumber: {
        type: String,
        required: true,
        match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
        unique: true
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

/**
 * Methods
 */
VendorSchema.method({
});

/**
 * Statics
 */
VendorSchema.statics = {
    /**
     * Get Vendor
     * @param {ObjectId} id - The objectId of Vendor.
     * @returns {Promise<Vendor, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((Vendor) => {
                if (Vendor) {
                    return Vendor;
                }
                const err = new APIError('No such Vendor exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List Vendors in descending Vendor of 'createdAt' timestamp.
     * @param {number} skip - Number of Vendors to be skipped.
     * @param {number} limit - Limit number of Vendors to be returned.
     * @returns {Promise<Vendor[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    }
};

/**
 * @typedef Vendor
 */
module.exports = mongoose.model('Vendor', VendorSchema);