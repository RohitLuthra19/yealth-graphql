var User = require('../models/user.model');

/**
 * Check user exists.
 */
/* function isexists(req, res, next) {
    User.findOne({ mobileNumber: req.params.mobileNumber }, function (err, user) {
        if (err)
            return next(err);

        if (!user) {
            return res.json({ success: false, error: false, message: 'User does not exists!' });
        }
        else {
            return res.json({ success: true, error: false, message: 'User does exists!' });
        }
    });
} */

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
    User.get(id)
        .then((user) => {
            req.user = user; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
    return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.city - The city of user.
 * @returns {User}
 */

function signup(req, res, next) {
    User.update({ _id: req.body.userId },
        {
            name: req.body.name,
            email: req.body.email,
            city: req.body.city,
            isSignupCompleted: true
        }, { new: true }).then(user => {
            if (!user) {
                res.json({ success: false, error: false, message: 'SignUp failed! User not registered!' });
            }
            else {
                return res.json({ success: true, error: false, message: 'Signup successful', user: user });
            }
        })
        .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
    User.findOneAndUpdate({ _id: req.body.userId },
        {
            name: req.body.name,
            email: req.body.email,
            city: req.body.city,
            address: req.body.address
        }).then(user => {
            if (!user) {
                res.json({ success: false, error: false, message: 'User not found!' });
            }
            else {
                return res.json({ success: true, error: false, message: 'User updated successfully', user: user });
            }
        })
        .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip })
        .then(users => res.json(users))
        .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
    const user = req.user;
    user.remove()
        .then(deletedUser => res.json(deletedUser))
        .catch(e => next(e));
}


function updateAddress(req, res, next) {
    var addresses = req.body.address;
    User.findOneAndUpdate({ _id: req.body.userId },
        { "$push": { "address": { "$each": addresses } } })
        .then(user => {
            if (!user) {
                res.json({ success: false, error: false, message: 'User not registered!' });
            }
            else {
                return res.json({ success: true, error: false, message: 'User address updated successfully', user: user });
            }
        })
        .catch(e => next(e));
}


module.exports = { load, get, signup, update, list, remove, updateAddress };
