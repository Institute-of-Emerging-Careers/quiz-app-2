const express = require("express");
const router = express.Router();
const {
  ApplicationRound,
  Course,
  ApplicationRoundCourseJunction,
  Application,
} = require("../../db/models/application");

const { Student, Assignment } = require("../../db/models/user");

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
  const application_rounds = await ApplicationRound.findAll({
    include: [{ model: Application, attributes: ["id"] }],
  });

  res.json({
    application_rounds: application_rounds,
    courses: await Course.findAll({ attributes: ["id", "title"] }),
  });
});

router.get(
  "/round/change-open-state/:application_round_id/:new_val",
  checkAdminAuthenticated,
  async (req, res) => {
    ApplicationRound.update(
      { open: req.params.new_val },
      { where: { id: req.params.application_round_id } }
    )
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  }
);

router.post("/course/new", checkAdminAuthenticated, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(200).json(course);
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
        include: [
          {
            model: Student,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "cnic",
              "email",
              "gender",
            ],
          },
          "first preference",
          "second preference",
          "third preference",
        ],
      });

      res.json({ applications: applications });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

// the following request responds with a list of applications corresponding to a specified ApplicationRoundId. For each application/student, it also returns a boolean "added" property specifying whether or not this student has already been assigned a specified Quiz
router.get(
  "/all-applicants-and-quiz-assignments",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const application_round = await ApplicationRound.findOne({
        where: { id: req.query.application_round_id },
      });
      if (application_round == null) {
        res.sendStatus(404);
        return;
      }
      let applications = await application_round.getApplications({
        include: [
          {
            model: Student,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "cnic",
              "email",
              "gender",
            ],
          },
          "first preference",
          "second preference",
          "third preference",
        ],
      });

      let data = [];

      // set "added" property of Student to true if student has already been assigned this quiz
      await new Promise(async (resolve) => {
        let x = 0;
        const n = applications.length;
        if (n == 0) resolve();
        for (let i = 0; i < n; i++) {
          const cur_index = data.push({}) - 1;
          data[cur_index] = JSON.parse(JSON.stringify(applications[i]));
          const assignments = await applications[i].Student.getAssignments({
            where: { QuizId: req.query.quiz_id },
          });
          data[cur_index].Student.added = false;
          if (assignments.length > 0) {
            data[cur_index].Student.already_added = true;
          } else {
            data[cur_index].Student.already_added = false;
          }
          x++;
          if (x == n) resolve(data);
        }
      });

      res.json({ applications: data });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/courses/:application_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const application_round = await ApplicationRound.findOne({
        where: { id: req.params.application_round_id },
      });
      if (application_round == null) {
        res.sendStatus(400);
        return;
      }
      const courses = await application_round.getCourses({ raw: true });
      res.json(
        courses.map((course) => ({ title: course.title, id: course.id }))
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get("/delete/:application_id", checkAdminAuthenticated, (req, res) => {
  Application.destroy({ where: { id: req.params.application_id } })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
