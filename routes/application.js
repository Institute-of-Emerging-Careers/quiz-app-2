const express = require("express");
const router = express.Router();

const checkAdminAuthenticated = require("../db/check-admin-authenticated");

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", checkAdminAuthenticated, (req, res) => {
  res.render("admin/application/index.ejs", {
    env: process.env.NODE_ENV,
    myname: req.user.user.firstName,
    user_type: req.user.type,
    site_domain_name: process.env.SITE_DOMAIN_NAME,
    current_url: `/admin/application${req.url}`,
  });
});

router.get("/all-rounds", checkAdminAuthenticated, (req, res) => {});

module.exports = router;
