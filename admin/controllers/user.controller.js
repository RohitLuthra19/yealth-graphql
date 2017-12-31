var AdminUser = require('../models/adminuser.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
    AdminUser.get(id)
        .then((user) => {
            req.user = user; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get user
 * @returns {AdminUser}
 */
function get(req, res) {
    return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.email - The email of user.
 * @returns {AdminUser}
 */

function signup(req, res, next) {
    req.body.isSignupCompleted = true;
    const adminuser = new AdminUser(req.body);

    adminuser.save()
        .then(adminuser => {
            return res.json({ success: true, error: false, message: 'Signup successful', user: adminuser });
        })
        .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {AdminUser}
 */
function update(req, res, next) {
    AdminUser.findOneAndUpdate({ email: email },
        {
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            password: req.body.password,
            deviceToken: req.body.deviceToken,
            environment: req.body.environment,
            osVersion: req.body.osVersion,
            buildVersion: req.body.buildVersion,
            device: req.body.device
        })
        .then((user) => {
            //Modify user object
            user.password = undefined;
            user.save();
            if (!user) {
                res.json({ success: false, message: 'User not updated!', user: user });
            }
            else {
                res.json({ success: true, message: 'User updated successfully!', user: user });
            }
        })
        .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {AdminUser[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    AdminUser.list({ limit, skip })
        .then(users => res.json(users))
        .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {AdminUser}
 */
function remove(req, res, next) {
    const user = req.user;
    user.remove()
        .then(deletedAdminUser => res.json(deletedAdminUser))
        .catch(e => next(e));
}

module.exports = { load, get, signup, update, list, remove };
