const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const randomstring = require("randomstring");
const checkAdminAuthenticated = require("../db/check-admin-authenticated");
const { generateRandomNumberInRange } = require("../functions/utilities");
const {
  InterviewRound,
  Interviewer,
  InterviewerInvite,
} = require("../db/models/interview");
const { DateTime } = require("luxon");
const { sendHTMLMail } = require("../functions/sendEmail");

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

router.patch(
  "/update-round-title/:interview_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const interview_round = await InterviewRound.findOne({
        where: { id: req.params.interview_round_id },
      });
      if (interview_round == null) res.sendStatus(401);
      else {
        await interview_round.update({ title: req.body.title });
        res.sendStatus(200);
      }
    } catch (err) {
      res.sendStatus(501);
    }
  }
);
router.post("/send-emails", checkAdminAuthenticated, async (req, res) => {
  const email_content = req.body.email_content;
  try {
    await new Promise((resolve) => {
      let i = 0;
      const n = req.body.interviewers.length;
      req.body.interviewers.forEach(async (interviewer) => {
        await sendHTMLMail(interviewer.email, `${email_content.subject}`, {
          heading: email_content.heading,
          inner_text: email_content.body,
          button_announcer: email_content.button_pre_text,
          button_text: email_content.button_label,
          button_link: email_content.button_url,
        });
        i++;
        if (i == n) resolve();
      });
    });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(501);
  }
});

router.post(
  "/update-interviewer-list/:interview_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const interview_round = await InterviewRound.findOne({
        where: { id: req.params.interview_round_id },
      });
      const interviewers = await interview_round.getInterviewers();
      let db_interviewers_map = new Map();
      interviewers.forEach((interviewer_object) => {
        db_interviewers_map.set(interviewer_object.email, interviewer_object);
      });

      let new_interviewers_map = new Map();
      req.body.interviewers.forEach((interviewer) => {
        new_interviewers_map.set(interviewer.email, true);
      });

      await new Promise((resolve) => {
        let i = 0;
        const n = req.body.interviewers.length;
        if (req.body.interviewers.length == 0) resolve();
        else {
          req.body.interviewers.forEach(async (interviewer) => {
            if (!db_interviewers_map.has(interviewer.email)) {
              const new_interviewer = await Interviewer.create({
                name: interviewer.name,
                email: interviewer.email,
                password: await bcrypt.hash(
                  randomstring.generate({
                    length: generateRandomNumberInRange(14, 20),
                  }),
                  10
                ),
              });
              await InterviewerInvite.create({
                InterviewerId: new_interviewer.id,
                InterviewRoundId: req.params.interview_round_id,
              });
              db_interviewers_map.delete(interviewer.email);
            }
            i++;
            if (i == n) resolve();
          });
        }
      });

      await new Promise(async (resolve) => {
        let i = 0;
        const n = db_interviewers_map.size;
        if (n == 0) resolve();
        else {
          for (const interviewer of db_interviewers_map) {
            if (!new_interviewers_map.has(interviewer[1].email)) {
              await interviewer[1].destroy();
              await InterviewerInvite.destroy({
                where: {
                  InterviewerId: interviewer[1].id,
                  InterviewRoundId: req.params.interview_round_id,
                },
              });
            }
            i++;
            if (i == n) resolve();
          }
        }
      });

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(501);
    }
  }
);

router.get(
  "/interviewers/all/:interview_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    const interview_round = await InterviewRound.findOne({
      where: { id: req.params.interview_round_id },
    });

    if (interview_round == null) res.sendStatus(404);
    else {
      const interviewers = await interview_round.getInterviewers({
        attributes: ["name", "email"],
      });
      res.status(200).json(interviewers);
    }
  }
);

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
