const express = require("express");
const router = express.Router();
const checkAdminAuthenticated = require("../db/check-admin-authenticated");
const { InterviewRound } = require("../db/models/interview");
const { DateTime } = require("luxon");

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", checkAdminAuthenticated, (req, res) => {
  res.render("admin/interview/index.ejs", {
    env: process.env.NODE_ENV,
    myname: req.user.user.firstName,
    user_type: req.user.type,
    site_domain_name: process.env.SITE_DOMAIN_NAME,
  });
});

router.get("/new/:quiz_id", checkAdminAuthenticated, (req, res) => {
  const new_interview_round_name = `Interview Round ${DateTime.now().toFormat(
    "hh:mm:ss-yyyy-LLL-dd"
  )}`;
  InterviewRound.create({
    title: new_interview_round_name,
    QuizId: req.params.quiz_id,
  }).then((interview_round) => {
    res.render("admin/interview/new.ejs", {
      interview_round_name: new_interview_round_name,
      interview_round_id: interview_round.id,
      env: process.env.NODE_ENV,
      user_type: req.user.type,
    });
  });
});

router.get("/edit/:interview_round_id", checkAdminAuthenticated, (req, res) => {
  InterviewRound.findOne({
    where: { id: req.params.interview_round_id },
  })
    .then((interview_round) => {
      if (interview_round != null) {
        res.render("admin/interview/new.ejs", {
          interview_round_name: interview_round.title,
          interview_round_id: interview_round.id,
          env: process.env.NODE_ENV,
          user_type: req.user.type,
        });
      } else {
        res.render("templates/error.ejs", {
          additional_info: "No such interview round exists",
          error_message:
            "You must have entered the wrong URL into the address bar of your browser. Please recheck or contact IT.",
          action_link: "/interview",
          action_link_text: "Return to Interview Panel",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/all", checkAdminAuthenticated, (req, res) => {
  InterviewRound.findAll({ order: [["id", "desc"]] })
    .then((interview_rounds) => {
      res.json({ success: true, interview_rounds: interview_rounds });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

module.exports = router;
