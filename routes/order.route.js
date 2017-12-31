var express = require('express');
var validate = require('express-validation');
var orderController = require('../controllers/order.controller');
var Middlewares = require('../helpers/middlewares');

const router = express.Router();

router.route('/')
  .get(Middlewares.appTokenParam, orderController.list)
   
  .post(Middlewares.appTokenBody, orderController.placeOrder)
  
  .put(Middlewares.appTokenBody, orderController.updateOrder);

router.route('/status')
  .put(Middlewares.appTokenBody, orderController.updateStatus);

router.route('/:orderId')
  .get(Middlewares.appTokenParam, orderController.get); 

router.route('/getordersbyuser')
  .post(Middlewares.appTokenBody, orderController.getOrdersByUser); 

module.exports = router; 
