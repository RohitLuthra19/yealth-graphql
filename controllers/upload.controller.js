var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var APIError = require('../helpers/APIError');
var Common = require('../helpers/common');

var s3Options = {
    region: config.awsRegion,
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKeyId
};

aws.config.update(s3Options);

var s3 = new aws.S3();

var prescriptionStorage = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.s3Bucket,
        key: function (req, file, cb) {
            var originalfilename = file.originalname;
            var fileExtension = originalfilename.split(".")[1];
            var fileName = file.fieldname + '-' + Date.now() + '.' + fileExtension;
            cb(null, req.params.mobileNumber + '/orders/' + fileName);
        }
        /* metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        } */
    })
});
var uploadPrescriptionStorage = prescriptionStorage.array('prescriptionImages', 20);

function uploadPrescription(req, res, next) {

    uploadPrescriptionStorage(req, res, function (err) {
        if (err) {
            return next(err);
        }
        return res.json({ success: true, error: false, message: 'File(s) are uploaded successfully!', PrescriptionImages: req.files });
    });

}

module.exports = { uploadPrescription };
