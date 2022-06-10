// Note: the application.js routes inside the admin folder catch the routes /admin/application/* whereas this application.js file catches routes /application/*
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const { Student, Assignment } = require("../db/models/user");

const checkAnyoneAlreadyAuthenticated = require("../db/check-anyone-already-authenticated");
const { ApplicationRound, Application } = require("../db/models/application");
const {
  cities,
  provinces,
  countries,
  education_levels,
  type_of_employment,
  sources_of_information,
} = require("../db/data_lists");

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
          sources_of_information: sources_of_information,
          application_round_id: req.params.application_round_id,
        });
      } else {
        res.render("templates/error.ejs", {
          additional_info: "",
          error_message:
            "This link is invalid or something went wrong at the server. Error code 01.",
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
  "/check-if-user-exists",
  checkAnyoneAlreadyAuthenticated,
  async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.cnic);
    const student = [
      await Student.findOne({
        where: { email: req.body.email, cnic: req.body.cnic },
        attributes: ["id"],
      }),
      await Student.findOne({
        where: { cnic: req.body.cnic },
        attributes: ["id"],
      }),
      await Student.findOne({
        where: { email: req.body.email },
        attributes: ["id"],
      }),
    ];

    // check if student with this email/cnic/both has already submitted an application for this cohort (ApplicationRound) before.
    if (student[0] != null || student[1] != null || student[2] != null) {
      const student_found = student.reduce((found, cur) => {
        if (found != null) return found;
        if (cur != null) return cur;
      }, null);

      const old_application = await student_found.getApplications({
        where: { ApplicationRoundId: req.body.application_round_id },
      });
      if (old_application.length > 0) {
        res.json({ exists: true, type: "already_applied" });
        return;
      }
    }

    if (student[0] != null) {
      res.json({ exists: true, type: "both_cnic_and_email" });
    } else if (student[1] != null) {
      res.json({ exists: true, type: "cnic_only" });
    } else if (student[2] != null)
      res.json({ exists: true, type: "email_only" });
    else {
      res.json({ exists: false });
    }
  }
);

router.post(
  "/submit/:application_round_id",
  checkAnyoneAlreadyAuthenticated,
  async (req, res) => {
    const errorField = (str) => {
      if (str == "students_email") return "email";
      else return str;
    };

    const errorMessage = (err_field, err_type, err_msg) => {
      if (err_type == "unique violation")
        return `${err_field} is already taken. This means you have already applied before. Make sure you use the same pair of Email and CNIC as your last application.`;
      else return err_msg;
    };

    try {
      // Each Student has many Applications. We need to ascertain whether this student is new or exists previously.
      let student = await Student.findOne({
        where: { email: req.body.email, cnic: req.body.cnic },
      });
      if (student == null) {
        if (req.body.password != req.body.password2) {
          res.status(400).json({
            error: "mismatch",
            field: "password",
            type: "",
            message: "Password and password confirmation don't match.",
          });
          return;
        }
        student = Student.build({
          email: req.body.email,
          cnic: req.body.cnic,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          gender: req.body.gender,
          password: await bcrypt.hash(req.body.password, 10),
        });
        await student.validate();
        student = await student.save();
      } else {
        const old_application = await student.getApplications({
          where: { ApplicationRoundId: req.params.application_round_id },
        });
        if (old_application.length > 0) {
          res.sendStatus(403);
          return;
        }
      }

      // construct student object
      let obj = {};
      const unset_attributes = ["createdAt", "updatedAt", "id"]; //to let these be set automatically
      for (let key in Application.rawAttributes) {
        obj[key] = req.body.hasOwnProperty(key) ? req.body[key] : null;
      }
      unset_attributes.forEach((attr) => {
        delete obj[attr];
      });
      obj.StudentId = student.id;
      obj.ApplicationRoundId = req.params.application_round_id;
      obj.rejection_email_sent = false;

      // creating application
      let application = Application.build(obj);

      // validating application information
      await application.validate(); //the "catch" gets this if validation fails
      application = await application.save();
      res.sendStatus(201);
    } catch (err) {
      if (err.errors) {
        console.log(err.errors[0]);
        const error_path_array = err.errors[0].path.split(".");
        let error_obj = {
          error: err.errors[0].type,
          field: errorField(
            error_path_array.length == 1
              ? error_path_array[0]
              : error_path_array[1]
          ),
          type: err.errors[0].validatorName,
          message: errorMessage(
            errorField(err.errors[0].path.split(".")[1]),
            err.errors[0].type,
            err.errors[0].message
          ),
        };

        res.status(400).json(error_obj);
      } else {
        res.sendStatus(500);
        console.log(err);
      }
    }
  }
);

module.exports = router;
