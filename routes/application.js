// Note: the application.js routes inside the admin folder catch the routes /admin/application/* whereas this application.js file catches routes /application/*
const express = require("express");
const router = express.Router();

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
  "/:application_id",
  checkAnyoneAlreadyAuthenticated,
  async (req, res) => {
    try {
      const application_round = await ApplicationRound.findOne({
        where: { id: req.params.application_id },
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

module.exports = router;
