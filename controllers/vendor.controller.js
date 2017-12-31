var Vendor = require('../models/vendor.model');

/**
 * Create new vendor
 * @property {string} req.body.name - The name of vendor.
 * @property {string} req.body.mobileNumber - The mobileNumber of vendor.
 * @property {string} req.body.address - The address of vendor.
 * @returns {Vendor}
 */

function signup(req, res, next) {
    const vendor = new Vendor({
        name: req.body.name,
        address: req.body.address,
        mobileNumber: req.body.mobileNumber,
    });

    vendor.save()
        .then(order => {
            return res.json({ success: true, error: false, message: 'Vendor placed successfully', vendor: vendor });
        })
        .catch(e => next(e));
}

/**
 * Create new vendor
 * @property {string} req.body.name - The name of vendor.
 * @property {string} req.body.mobileNumber - The mobileNumber of vendor.
 * @property {string} req.body.address - The address of vendor.
 * @returns {Vendor}
 */
function update(req, res, next) {
    Vendor.findOneAndUpdate({ _id: req.body.vendorId },
        {
            name: req.body.name,
            address: req.body.address,
            mobileNumber: req.body.mobileNumber,
        }, { new: true }).then(vendor => {
            if (!vendor) {
                res.json({ success: false, error: false, message: 'Vendor not found!' });
            }
            else {
                return res.json({ success: true, error: false, message: 'Vendor updated successfully', vendor: vendor });
            }
        })
        .catch(e => next(e));
}

/**
 * Get vendor list.
 * @property {number} req.query.skip - Number of vendors to be skipped.
 * @property {number} req.query.limit - Limit number of vendors to be returned.
 * @returns {Vendor[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Vendor.list({ limit, skip })
        .then(vendors => res.json({ success: true, error: false, message: 'Vendor returned successfully!', vendors: vendors }))
        .catch(e => next(e));
}

/**
 * Delete vendor.
 * @returns {Vendor}
 */
function remove(req, res, next) {
    const vendor = req.vendor;
    vendor.remove()
        .then(deletedVendor => res.json({ success: true, error: false, message: 'Vendor returned successfully!', vendor: deletedVendor }))
        .catch(e => next(e));
}

/**
 * Get vendor.
 * @property {number} req.params.vendorId - id of the vendor
 * @returns {Vendor}
 */
function get(req, res, next) {
    Vendor.findOne({ _id: req.params.vendorId })
        .then(vendor => {
            if (!vendor) {
                return res.status(403).send({ success: false, error: false, message: 'Vendor not found!' });
            }
            else {
                return res.json({ success: true, error: false, message: 'Vendor returned successfully!', vendor: vendor })
            }
        })
        .catch(e => next(e));
}

module.exports = { get, signup, update, list, remove };
