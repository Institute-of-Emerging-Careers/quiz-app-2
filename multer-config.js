const multer = require("multer");
const { Student } = require("./db/models")
const multerS3 = require('multer-s3')
const s3 = require("./s3-config")

// Multer config for image upload
var img_storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: function (req, file, cb) {
    switch (file.mimetype) {
      case "image/jpeg":
        ext = ".jpeg";
        break;
      case "image/png":
        ext = ".png";
        break;
    }
    cb(null, file.originalname + "-" + Date.now() + ext);
  },
});

var img_upload = multer({ storage: img_storage });

// Multer config for file upload (image and audio allowed)
var file_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    switch (file.mimetype) {
      case "image/jpeg":
        upload_folder = "./uploads/images";
        break;
      case "image/png":
        upload_folder = "./uploads/images";
        break;
      case "audio/mpeg":
        upload_folder = "./uploads/audio";
        break;
    }
    cb(null, upload_folder);
  },
  filename: function (req, file, cb) {
    switch (file.mimetype) {
      case "image/jpeg":
        ext = ".jpeg";
        break;
      case "image/png":
        ext = ".png";
        break;
      case "audio/mpeg":
        ext = ".mp3";
        break;
    }
    cb(null, file.originalname + "-" + Date.now() + ext);
  },
});

var file_upload = multer({ storage: file_storage });

// Multer config for csv file upload
var csv_storage = multer.diskStorage({
  destination: "./uploads/csv",
  filename: function (req, file, cb) {
    ext = ".csv";
    cb(null, file.originalname + "-" + Date.now() + ext);
  },
});

var csv_upload = multer({ storage: csv_storage });

// Multer configuration for PDF file upload for LEC Agreements
const pdf_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.LEC_BUCKET_NAME, // Bucket name
    metadata: function (req, file, cb) {
      cb(null, Object.assign({}, { ...req.body, student_id: req.user.user.id.toString() }));
    },
    key: async function (req, file, cb) {
      const cnic = (await Student.findOne({ where: { id: req.user.user.id }, attributes: ["cnic"] })).cnic;
      cb(null, `${cnic}.pdf`); // Unique filename for uploaded file
    }
  }),
  fileFilter: function (req, file, cb) {
    // Only accept pdf files
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed.'));
    }
    cb(null, true);
  }
});

module.exports = { img_upload, file_upload, csv_upload, pdf_upload };
