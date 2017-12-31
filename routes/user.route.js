var express = require( 'express');
var validate = require( 'express-validation');
var paramValidation = require( '../config/param-validation');
var userController = require( '../controllers/user.controller');
var Middlewares = require('../helpers/middlewares');

const router = express.Router(); // eslint-disable-line new-cap

/* router.route('isexists/:mobileNumber')
  .get(userController.isexists); */

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userController.list)

  /** POST /api/users - Create new user */
  .post(Middlewares.appTokenBody, userController.signup);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userController.get)

  /** PUT /api/users- Update user */
  .put(Middlewares.appTokenBody, userController.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userController.remove);

router.route('/address')
  /** PUT /api/users/address- Update user address*/
  .put(Middlewares.appTokenBody, userController.updateAddress)

/** Load user when API with userId route parameter is hit */
/* router.param('userId', userController.load); */

module.exports = router;
