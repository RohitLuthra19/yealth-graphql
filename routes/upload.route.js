var express = require('express');
var uploadController = require('../controllers/upload.controller');
const router = express.Router(); // eslint-disable-line new-cap

var Middlewares = require('../helpers/middlewares');

router.route('/prescription' )
  .post(Middlewares.appTokenParam, uploadController.uploadPrescription)

module.exports = router;
