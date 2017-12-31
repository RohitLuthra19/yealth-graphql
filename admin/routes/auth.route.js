var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var authController = require('../controllers/auth.controller');
var config = require('../config/config');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /admin/api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
    .post(authController.login);

/** GET /admin/api/auth/random-number - Protected route needs token in header */
router.route('/random-number')
    .get(expressJwt({ secret: config.adminJwtSecret }), authController.getRandomNumber);

module.exports = router;
