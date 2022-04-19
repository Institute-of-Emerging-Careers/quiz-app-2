const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");

// requirements
const checkAdminAuthenticated = require("../db/check-admin-authenticated");
const checkAdminAlreadyLoggedIn = require("../db/check-admin-already-logged-in");
const orientationRouter = require("./orientation");
const interviewRouter = require("./interview");
const { Quiz } = require("../db/models/quizmodel.js");
const { Invite } = require("../db/models/user");

// middleware that is specific to this router
router.use("/orientation", orientationRouter);
router.use("/interview", interviewRouter);

router.use((req, res, next) => {
  next();
});

router.get("/", checkAdminAuthenticated, async (req, res) => {
  try {
    const all_quizzes = await Quiz.findAll();
    for (let i = 0; i < all_quizzes.length; i++) {
      all_quizzes[i].num_sections = await all_quizzes[i].countSections();
      const all_sections = await all_quizzes[i].getSections();
      let total_questions = 0;
      for (let j = 0; j < all_sections.length; j++) {
        total_questions += await all_sections[j].countQuestions();
      }
      all_quizzes[i].num_questions = total_questions;
    }
    const all_invites = await Invite.findAll({ include: [Quiz] });
    res.render("admin/index.ejs", {
      myname: req.user.user.firstName,
      user_type: req.user.type,
      all_quizzes: all_quizzes,
      all_invites: all_invites,
      site_domain_name: process.env.SITE_DOMAIN_NAME,
      moment: moment,
      query: req.query,
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/login", checkAdminAlreadyLoggedIn, (req, res) => {
  res.render("admin/login/index.ejs");
});

router.post(
  "/login",
  passport.authenticate("admin-login", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })
);

module.exports = router;
