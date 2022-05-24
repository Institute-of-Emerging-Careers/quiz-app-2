const express = require("express");
const router = express.Router();
const {
  ApplicationRound,
  Course,
  ApplicationRoundCourseJunction,
} = require("../../db/models/application");

const { Student } = require("../../db/models/user");

const checkAdminAuthenticated = require("../../db/check-admin-authenticated");

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

router.get("/rounds/all", checkAdminAuthenticated, async (req, res) => {
  res.json({
    application_rounds: await ApplicationRound.findAll(),
    courses: await Course.findAll({ attributes: ["id", "title"] }),
  });
});

router.post("/course/new", checkAdminAuthenticated, async (req, res) => {
  try {
    await Course.create(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(501);
  }
});

router.post("/rounds/new", checkAdminAuthenticated, async (req, res) => {
  const new_application_round = await ApplicationRound.create({
    title: req.body.title,
  });

  Promise.all(
    req.body.courses.map((course) =>
      ApplicationRoundCourseJunction.findOrCreate({
        where: {
          ApplicationRoundId: new_application_round.id,
          CourseId: course.id,
        },
      })
    )
  )
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(501);
    });
});

router.delete(
  "/rounds/delete/:application_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      await ApplicationRound.destroy({
        where: { id: req.params.application_round_id },
      });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(501);
    }
  }
);

router.get(
  "/view/:application_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const application_round = await ApplicationRound.findOne({
        where: { id: req.params.application_round_id },
      });
      if (application_round == null) {
        res.status(404).render("templates/error.ejs", {
          additional_info:
            "https://" +
            process.env.SITE_DOMAIN_NAME +
            "/application/view/" +
            req.params.application_round_id,
          error_message: "The above link is invalid.",
          action_link: "/admin/application",
          action_link_text: "Click here to go to the Applications home page.",
        });
        return;
      }

      res.render("admin/application/view_round.ejs", {
        application_round_id: req.params.application_round_id,
        myname: req.user.user.firstName,
        user_type: req.user.type,
        env: process.env.NODE_ENV,
        current_url: `/admin/application${req.url}`,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);
router.get(
  "/all-applicants/:application_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const application_round = await ApplicationRound.findOne({
        where: { id: req.params.application_round_id },
      });
      if (application_round == null) {
        res.sendStatus(404);
        return;
      }
      const applications = await application_round.getApplications({
        include: [Student],
      });

      res.json({ applications: applications });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
