var express = require('express');
var vendorController = require('../controllers/vendor.controller');
var Middlewares = require('../helpers/middlewares');

const router = express.Router();

router.route('/')
    /** GET /api/vendors - Get list of vendors */
    .get(vendorController.list)

    /** POST /api/vendors - Create new vendors */
    .post(vendorController.signup)

    /** PUT /api/vendors - Update vendor */
    .put(vendorController.update)

    /** PUT /api/vendors - Remove vendor */
    .post(vendorController.remove);

router.route('/:vendorId')
    /** GET /api/vendors - Get vendor */
    .get(vendorController.get);

module.exports = router;