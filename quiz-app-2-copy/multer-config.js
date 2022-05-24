const multer = require("multer");

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
    console.log(file.mimetype);
    switch (file.mimetype) {
      case "application/vnd.ms-excel":
        ext = ".csv";
        break;
    }
    cb(null, file.originalname + "-" + Date.now() + ext);
  },
});

var csv_upload = multer({ storage: csv_storage });

module.exports = { img_upload, file_upload, csv_upload };
