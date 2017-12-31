var express = require( 'express');
var validate = require( 'express-validation');
var userController = require( '../controllers/user.controller');
var Middlewares = require('../helpers/middlewares');

const router = express.Router(); // eslint-disable-line new-cap

/* router.route('isexists/:mobileNumber')
  .get(userController.isexists); */

router.route('/')
  /** GET /admin/api/users - Get list of users */
  .get(userController.list)

  /** POST /admin/api/users - Create new user */
  .post(userController.signup);

router.route('/:userId')
  /** GET /admin/api/users/:userId - Get user */
  .get(userController.get)

  /** PUT /admin/api/users/:userId - Update user */
  .put(userController.update)

  /** DELETE /admin/api/users/:userId - Delete user */
  .delete(userController.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userController.load);

module.exports = router;
