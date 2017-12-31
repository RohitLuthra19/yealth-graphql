var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../../helpers/APIError');
var bcrypt = require('bcryptjs');

/**
 * AdminUser Schema
 */
const AdminUserSchema = new mongoose.Schema({
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
    password: {
        type: String
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
 * Methods
 */
AdminUserSchema.method({
});

AdminUserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else{
        return next();
    }
});

AdminUserSchema.methods.comparePassword = function(pwd, cb){
    bcrypt.compare(pwd, this.password, function(err, isMatch){
        if(err){
            return cb(err);
        }
        cb(null, isMatch);
    });
};

/**
 * Statics
 */
AdminUserSchema.statics = {
    /**
     * Get AdminUser
     * @param {ObjectId} id - The objectId of AdminUser.
     * @returns {Promise<AdminUser, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((AdminUser) => {
                if (AdminUser) {
                    return AdminUser;
                }
                const err = new APIError('No such AdminUser exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List AdminUsers in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of AdminUsers to be skipped.
     * @param {number} limit - Limit number of AdminUsers to be returned.
     * @returns {Promise<AdminUser[]>}
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
 * @typedef AdminUser
 */
module.exports = mongoose.model('AdminUser', AdminUserSchema);
