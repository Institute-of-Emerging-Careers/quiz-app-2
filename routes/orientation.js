const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
// My requirements
const checkAdminAuthenticated = require("../db/check-admin-authenticated");
const { Orientation } = require("../db/models/orientation");

//this file deals with /admin/orientation/...

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", checkAdminAuthenticated, (req, res) => {
  res.render("admin/orientation/index.ejs", {
    env: process.env.NODE_ENV,
    myname: req.user.user.firstName,
    user_type: req.user.type,
    site_domain_name: process.env.SITE_DOMAIN_NAME,
  });
});

router.get("/summary", checkAdminAuthenticated, (req, res) => {
  res.render("admin/orientation/summary.ejs", {
    myname: req.user.user.firstName,
    user_type: req.user.type,
    site_domain_name: process.env.SITE_DOMAIN_NAME,
  });
});

router.get("/all", checkAdminAuthenticated, (req, res) => {
  Orientation.findAll({
    attributes: ["id", "title"],
    order: [["id", "desc"]],
  }).then((response) => {
    res.json({ success: true, data: response });
  });
});

router.get("/new", checkAdminAuthenticated, (req, res) => {
  res.render("admin/orientation/new.ejs", {
    edit: false,
    env: process.env.NODE_ENV,
    user_type: req.user.type,
  });
});

router.get("/create-new", checkAdminAuthenticated, (req, res) => {
  const new_orientation_name = `Orientation ${DateTime.now().toFormat(
    "hh:mm:ss-yyyy-LLL-dd"
  )}`;
  Orientation.create({ title: new_orientation_name }).then((orientation) => {
    res.json({
      success: true,
      orientation_id: orientation.id,
      orientation_name: new_orientation_name,
    });
  });
});

router.get(
  "/edit/:orientation_id",
  checkAdminAuthenticated,
  async (req, res) => {
    const orientation = await Orientation.findOne({
      where: { id: req.params.orientation_id },
      attributes: ["id", "title"],
    });
    if (orientation != null) {
      res.render("admin/orientation/new.ejs", {
        edit: orientation.id,
        orientation_name: orientation.title,
        env: process.env.NODE_ENV,
        user_type: req.user.type,
      });
    } else {
      res.render("templates/error.ejs", {
        additional_info: "Invalid Orientation",
        error_message: "The orientation you're trying to edit does not exist.",
        action_link: "/orientation",
        action_link_text: "Click here to go to the orientations page.",
      });
    }
  }
);

router.post("/change-name", checkAdminAuthenticated, async (req, res) => {
  console.log(req.body);
  const orientation = await Orientation.findOne({
    where: { id: req.body.orientation_id },
  });
  orientation
    .update({ title: req.body.orientation_name })
    .then((orientation) => {
      res.json({ success: true });
    });
});

module.exports = router;
