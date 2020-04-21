const aws = require('aws-sdk'),
      multer = require('multer'),
      multerS3 = require('multer-s3'),
      config = require('../config/main'),
      path = require('path')

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: config.AWS_REGION
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/plain' || file.mimetype === 'application/msword' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only plain text, pdf and doc is allowed!'), false);
  }
}

const upload = multer({
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
  storage: multerS3({
    s3: s3,
    bucket: 'hfs-files',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + path.extname(file.originalname))
    }
  })
});

module.exports = upload;
