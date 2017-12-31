var express = require('express');
var validate = require('express-validation');
var orderController = require('../controllers/order.controller');
var Middlewares = require('../helpers/middlewares');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(Middlewares.adminAppTokenParam, orderController.list)

  .put(Middlewares.adminAppTokenBody, orderController.updateOrder);


router.route('/:orderId')
  .get(Middlewares.adminAppTokenParam, orderController.get);


router.route('/updatestatus')
  .put(Middlewares.adminAppTokenBody, orderController.updateStatus);


router.route('/assign')
  .put(Middlewares.adminAppTokenBody, orderController.assign);

module.exports = router; 
