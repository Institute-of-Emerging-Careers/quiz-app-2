const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
// My requirements
const checkAdminAuthenticated = require("../db/check-admin-authenticated");
const { Orientation, OrientationInvite } = require("../db/models/orientation");
const { Student, Assignment, Attempt, Score } = require("../db/models/user");
const { Quiz, Section } = require("../db/models/quizmodel.js");
const getTotalMarksOfSection = require("../functions/getTotalMarksOfSection");
const allSectionsSolved = require("../functions/allSectionsSolved");
const roundToTwoDecimalPlaces = require("../functions/roundToTwoDecimalPlaces");
const getQuizTotalScore = require("../functions/getQuizTotalScore");

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

router.get(
  "/delete/:orientation_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      await Orientation.destroy({ where: { id: req.params.orientation_id } });
      res.json({ success: true });
    } catch (err) {
      res.json({ success: false });
    }
  }
);

router.get("/new/:quiz_id", checkAdminAuthenticated, (req, res) => {
  const new_orientation_name = `Orientation ${DateTime.now().toFormat(
    "hh:mm:ss-yyyy-LLL-dd"
  )}`;
  Orientation.create({
    title: new_orientation_name,
    QuizId: req.params.quiz_id,
  }).then((orientation) => {
    res.render("admin/orientation/new.ejs", {
      orientation_name: new_orientation_name,
      orientation_id: orientation.id,
      env: process.env.NODE_ENV,
      user_type: req.user.type,
    });
  });
});

router.get("/create-new/:quiz_id", checkAdminAuthenticated, (req, res) => {});

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
        orientation_id: orientation.id,
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

router.post(
  "/save/:orientation_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const orientation = await Orientation.findOne({
        where: { id: req.params.orientation_id },
      });
      await orientation.update({ title: req.body.orientation_name });

      // let's get all students who have already been invited to this Orientation and create a hashmap.
      let orientation_invites = await OrientationInvite.findAll({
        where: { OrientationId: req.params.orientation_id },
      });

      let students_already_invited = new Map();
      orientation_invites.map((invite) => {
        students_already_invited.set(invite.StudentId, invite);
      });

      let i = 0;
      const n = req.body.students.length;
      await new Promise((resolve, reject) => {
        req.body.students.map(async (student) => {
          if (
            student.added == false &&
            students_already_invited.has(student.id)
          ) {
            students_already_invited.get(student.id).destroy();
          } else if (
            student.added == true &&
            !students_already_invited.has(student.id)
          ) {
            await OrientationInvite.create({
              StudentId: student.id,
              OrientationId: req.params.orientation_id,
            });
          }
          i++;
          if (i == n) {
            resolve();
          }
        });
      });

      res.json({ success: true });
    } catch (err) {
      res.json({ success: false });
    }
  }
);

router.get(
  "/all-students/:orientation_id",
  checkAdminAuthenticated,
  async (req, res) => {
    const orientation = await Orientation.findOne({
      where: { id: req.params.orientation_id },
      attributes: ["id", "QuizId"],
      include: [{ model: Quiz, include: [Section] }],
    });

    if (orientation != null && orientation.QuizId != null) {
      // finding total score of quiz
      let quiz_total_score = await getQuizTotalScore(orientation.Quiz);

      let data = []; //list of students who have solved this quiz and their data

      let assignments = await Assignment.findAll({
        where: { QuizId: orientation.QuizId },
        include: [
          {
            model: Student,
            include: [Orientation],
          },
          {
            model: Attempt,
            include: [{ model: Section, order: ["id"] }, Score],
          },
        ],
      });

      if (assignments != null && assignments.length > 0) {
        assignments.forEach((assignment) => {
          // checking if this orientation exists in the

          const cur_index =
            data.push({
              added: assignment.Student.Orientations.length > 0,
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

          let remove_student = false; //we remove student from data if student turns out to have an unsolved section (no attempt)
          assignment.Attempts.forEach((attempt) => {
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
      console.log("Error: QuizId: or orientation:", orientation, "is NULL");
      res.json({ success: false });
    }
  }
);

module.exports = router;
