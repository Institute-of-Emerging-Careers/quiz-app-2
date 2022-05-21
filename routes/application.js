// Note: the application.js routes inside the admin folder catch the routes /admin/application/* whereas this application.js file catches routes /application/*
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const { Student, Assignment } = require("../db/models/user");

const checkAnyoneAlreadyAuthenticated = require("../db/check-anyone-already-authenticated");
const { ApplicationRound } = require("../db/models/application");
const {
  cities,
  provinces,
  countries,
  education_levels,
  type_of_employment,
} = require("../resources/js/data_lists");

router.use((req, res, next) => {
  next();
});

router.get(
  "/fill/:application_round_id",
  checkAnyoneAlreadyAuthenticated,
  async (req, res) => {
    try {
      const application_round = await ApplicationRound.findOne({
        where: { id: req.params.application_round_id },
      });
      if (application_round != null) {
        const courses = await application_round.getCourses({
          attributes: ["id", "title"],
        });
        res.render("application.ejs", {
          cities: cities,
          provinces: provinces,
          countries: countries,
          education_levels: education_levels,
          type_of_employment: type_of_employment,
          courses: courses,
          application_round_id: req.params.application_round_id,
        });
      } else {
        res.render("templates/error.ejs", {
          additional_info: "",
          error_message:
            "This link is invalid or something went wrong. Error code 01.",
          action_link: "/",
          action_link_text: "Click here to go to home page.",
        });
      }
    } catch (err) {
      console.log(err);
      res.render("templates/error.ejs", {
        additional_info: "",
        error_message:
          "This link is invalid or something went wrong. Error code 02.",
        action_link: "/",
        action_link_text: "Click here to go to home page.",
      });
    }
  }
);

router.post(
  "/submit/:application_round_id",
  checkAnyoneAlreadyAuthenticated,
  async (req, res) => {
    try {
      // continue here. Fill all information below. Figure out what to do with InviteId. Also figure out how to send back errors to HTML form if sequelize validation fails.

      // creating student
      let student = Student.build({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
        cnic: req.body.cnic,
        age: req.body.age,
        gender: req.body.gender,
        city: req.body.city,
        address: req.body.address,
        InviteId: invite.id,
      });

      // validating student information
      if (await student.validate()) {
        student = await student.save();

        // assign the quiz associated with the invite to this student
        await Assignment.create({
          StudentId: student.id,
          QuizId: invite.QuizId,
        });

        // send automated Welcome email to student
        try {
          await sendHTMLMail(email, `Welcome to IEC LCMS`, {
            heading: "Welcome to the IEC LCMS",
            inner_text:
              "We have sent you an assessment to solve. You have 72 hours to solve the assessment.",
            button_announcer:
              "Click on the button below to solve the Assessment",
            button_text: "Solve Assessment",
            button_link: "https://apply.iec.org.pk/student/login",
          });
        } catch (err) {
          console.log("Welcome email sending failed.");
        }
        res.redirect("/student/login");
      }
    } catch (err) {
      console.log(err);
      if (err.errors) {
        res.redirect(
          "/invite/" +
            invite_link +
            "?error=" +
            encodeURIComponent(err.errors[0].type) +
            "&field=" +
            encodeURIComponent(err.errors[0].path) +
            "&type=" +
            encodeURIComponent(err.errors[0].validatorName) +
            "&message=" +
            encodeURIComponent(err.errors[0].message)
        );
      } else res.redirect("/invite/" + invite_link);
    }
  }
);

module.exports = router;
