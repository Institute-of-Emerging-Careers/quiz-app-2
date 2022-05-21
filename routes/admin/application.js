const express = require("express");
const router = express.Router();
const {
  ApplicationRound,
  Course,
  ApplicationRoundCourseJunction,
} = require("../../db/models/application");

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

module.exports = router;
