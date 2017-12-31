var express = require('express');
var authRoutes = require('./auth.route');
var userRoutes = require('./user.route');
var orderRoutes = require('./order.route');
const router = express.Router(); // eslint-disable-line new-cap

// mount user routes at /users
router.use('/auth', authRoutes)
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);

module.exports = router;