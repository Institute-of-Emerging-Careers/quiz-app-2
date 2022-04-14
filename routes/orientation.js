const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
// My requirements
const checkAdminAuthenticated = require("../db/check-admin-authenticated");
const { Orientation } = require("../db/models/orientation");
const { Student, Assignment, Attempt, Score } = require("../db/models/user");
const { Quiz, Section } = require("../db/models/quizmodel.js");
const getTotalMarksOfSection = require("../functions/getTotalMarksOfSection");
const allSectionsSolved = require("../functions/allSectionsSolved");
const roundToTwoDecimalPlaces = require("../functions/roundToTwoDecimalPlaces");

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

router.get("/new/:quiz_id", checkAdminAuthenticated, (req, res) => {
  res.render("admin/orientation/new.ejs", {
    edit: false,
    orientation_name: "",
    quiz_id: req.params.quiz_id,
    env: process.env.NODE_ENV,
    user_type: req.user.type,
  });
});

router.get("/create-new/:quiz_id", checkAdminAuthenticated, (req, res) => {
  const new_orientation_name = `Orientation ${DateTime.now().toFormat(
    "hh:mm:ss-yyyy-LLL-dd"
  )}`;
  Orientation.create({
    title: new_orientation_name,
    QuizId: req.params.quiz_id,
  }).then((orientation) => {
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
        quiz_id: -1,
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

router.get(
  "/students-list/:orientation_id",
  checkAdminAuthenticated,
  async (req, res) => {
    const orientation = await Orientation.findOne({
      where: { id: req.params.orientation_id },
      attributes: ["id"],
    });

    if (orientation != null) {
      const students = await orientation.getStudents({
        attributes: ["firstName", "lastName", "email", "age", "gender", "city"],
      });
      res.json({ success: true, data: students });
    } else {
      res.json({ success: false });
    }
  }
);

router.get(
  "/all-candidates/:orientation_id",
  checkAdminAuthenticated,
  async (req, res) => {
    const orientation = await Orientation.findOne({
      where: { id: req.params.orientation_id },
      attributes: ["id", "QuizId"],
      include: [{ model: Quiz, include: [Section] }],
    });

    if (orientation != null && orientation.QuizId != null) {
      // finding total score of quiz
      let quiz_total_score = 0;
      await new Promise((resolve) => {
        let i = 0;
        const n3 = orientation.Quiz.Sections.length;
        orientation.Quiz.Sections.forEach(async (section) => {
          const num_questions_in_section = await section.countQuestions();
          const section_maximum_score = await getTotalMarksOfSection(
            section.id,
            section.poolCount,
            num_questions_in_section
          );
          quiz_total_score += section_maximum_score;
          i++;
          if (i == n3) resolve();
        });
      });

      let data = []; //list of students who have solved this quiz
      let assignments = await Assignment.findAll({
        where: { QuizId: orientation.QuizId },
        include: [
          Student,
          {
            model: Attempt,
            include: [{ model: Section, order: ["id"] }, Score],
          },
        ],
      });

      if (assignments != null && assignments.length > 0) {
        assignments.forEach(async (assignment) => {
          const cur_index =
            data.push({
              added: false,
              id: assignment.Student.id,
              name:
                assignment.Student.firstName +
                " " +
                assignment.Student.lastName,
              email: assignment.Student.email,
              age: assignment.Student.age,
              gender: assignment.Student.gender,
              total_score_achieved: 0,
              percentage_score: 0,
            }) - 1;

          let remove_student = false;
          assignment.Attempts.forEach(async (attempt) => {
            if (attempt == null || attempt.Score == null) {
              remove_student = true;
            } else {
              data[cur_index].total_score_achieved += attempt.Score.score;
            }
          });

          data[cur_index].percentage_score = roundToTwoDecimalPlaces(
            (data[cur_index].total_score_achieved / quiz_total_score) * 100
          );
          if (remove_student) data.pop();
        });
      }
      res.json({ success: true, data: data });
    } else {
      res.json({ success: false });
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
