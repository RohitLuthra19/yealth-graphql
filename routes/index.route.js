var express = require('express');
var authRoutes = require('./auth.route');
var userRoutes = require('./user.route');
var otpRoutes = require('./otp.route');
var uploadRoutes = require('./upload.route');
var orderRoutes = require('./order.route');
var vendorRoutes = require('./vendor.route');
const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/auth', authRoutes)
router.use('/users', userRoutes);
router.use('/users/otp', otpRoutes);
router.use('/users/upload', uploadRoutes);
router.use('/orders', orderRoutes);
router.use('/vendors', vendorRoutes);

module.exports = router;
