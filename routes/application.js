// Note: the application.js routes inside the admin folder catch the routes /admin/application/* whereas this application.js file catches routes /application/*
const express = require("express");
const router = express.Router();

const checkAnyoneAlreadyAuthenticated = require("../db/check-anyone-already-authenticated");

router.use((req, res, next) => {
  next();
});

router.get("/:application_id", checkAnyoneAlreadyAuthenticated, (req, res) => {
  res.render("application.ejs");
});

module.exports = router;
