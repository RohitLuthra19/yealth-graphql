var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    mobileNumber: {
        type: String,
        required: true,
        match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String
    },
    address: [{
        /* addressId: {
            type: mongoose.Schema.Types.ObjectId
        }, */
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
            type: Number
        },
        mobileNumber: {
            type: String,
            required: true,
            match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
        },
        lat: {
            type: Number
        },
        long: {
            type: Number
        },
        default: {}
    }],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    }],
    city: {
        type: String
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    },
    deviceToken: {
        type: String
    },
    environment: {
        type: String
    },
    osVersion: {
        type: String
    },
    buildVersion: {
        type: String
    },
    device: {
        type: String
    },
    isSignupCompleted: {
        type: Boolean,
        default: false
    }
});

/**
 * Statics
 */
UserSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
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
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);