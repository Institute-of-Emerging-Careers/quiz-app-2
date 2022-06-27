const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");

// requirements
const checkStudentAuthenticated = require("../db/check-student-authenticated");
const checkStudentAlreadyLoggedIn = require("../db/check-student-already-logged-in");
const { Quiz, Section } = require("../db/models/quizmodel.js");
const {
  Student,
  Invite,
  Assignment,
  Attempt,
  PasswordResetLink,
} = require("../db/models/user");

const calculateSingleAssessmentStatus = require("../functions/calculateSingleAssessmentStatus");

const { queueMail } = require("../bull");

// starting cron-jobs
const {
  assessment_reminder_mailer_task,
  score_past_deadline_attempts,
} = require("../functions/cron-ping");
const moment = require("moment");

assessment_reminder_mailer_task.start();
score_past_deadline_attempts.start();

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/orientation", async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.user.user.id } });
    const orientations = await student.getOrientations();

    res.render("student/orientation/index.ejs", {
      user_type: req.user.type,
      query: req.query,
      DateTime: DateTime,
      orientations: orientations,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/interview", (req, res) => {
  res.render("student/interview/index.ejs", {
    user_type: req.user.type,
    query: req.query,
  });
});

router.get("/onboarding", (req, res) => {
  res.render("student/onboarding/index.ejs", {
    user_type: req.user.type,
    query: req.query,
  });
});

router.post("/signup", async (req, res) => {
  const firstName = req.body.firstName,
    lastName = req.body.lastName,
    email = req.body.email,
    phone = req.body.phone,
    cnic = req.body.cnic,
    password = req.body.password,
    age = req.body.age,
    gender = req.body.gender,
    city = req.body.city,
    address = req.body.address,
    invite_link = req.body.invite;

  try {
    // to count the number of students who have registered using this particular invite link:
    const invite = await Invite.findOne({
      where: {
        link: invite_link,
      },
    });
    invite.increment("registrations");

    // creating student
    let student = Student.build({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: await bcrypt.hash(password, 10),
      phone: phone,
      cnic: cnic,
      age: age,
      gender: gender,
      city: city,
      address: address,
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
        await queueMail(email, `Welcome to IEC LCMS`, {
          heading: "Welcome to the IEC LCMS",
          inner_text:
            "We have sent you an assessment to solve. You have 72 hours to solve the assessment.",
          button_announcer: "Click on the button below to solve the Assessment",
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
});

router.get("/", checkStudentAuthenticated, async (req, res) => {
  if (req.query.link != undefined) {
    const invite = await Invite.findOne({
      where: { link: req.query.link },
      include: { model: Quiz, attributes: ["id"] },
    });
    const quizId = invite.Quiz.id;
    await Assignment.findOrCreate({
      where: { StudentId: req.user.user.id, QuizId: quizId },
    });
  }
  res.render("student/index.ejs", {
    user_type: req.user.type,
    query: req.query,
  });
});

router.get("/login", checkStudentAlreadyLoggedIn, async (req, res) => {
  res.render("student/login/index.ejs", {
    link: req.query.link,
    email: req.query.email,
    cnic: req.query.cnic,
    success: req.query.success,
    redirect: req.query.url,
  });
});

// render the forgot password page
router.get(
  "/forgot-password",
  checkStudentAlreadyLoggedIn,
  async (req, res) => {
    res.render("student/login/forgot_password.ejs", {
      link: req.query.link,
      error: req.query.error,
    });
  }
);

// set a new password
router.post("/change-password", async (req, res) => {
  if (req.body.password1 == req.body.password2) {
    try {
      const password = req.body.password1;
      const password_reset_link = await PasswordResetLink.findOne({
        where: {
          key: req.body.key,
          StudentId: req.body.id,
        },
        include: [Student],
      });

      if (password_reset_link != null) {
        await password_reset_link.Student.update({
          password: await bcrypt.hash(password, 10),
        });
        console.log("password updated for ", password_reset_link.Student.email);

        await password_reset_link.destroy();

        res.redirect("/student/login?success=password-reset");
      } else {
        res.render("templates/error.ejs", {
          additional_info: "Invalid Link",
          error_message:
            "The password reset link is invalid. Please go to the Student Login Page and click on Forgot Password to generate a valid link.",
          action_link: "/student/login",
          action_link_text: "Student Login Page",
        });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.render("student/login/set_new_password.ejs", {
      key: req.body.key,
      student_id: req.body.id,
      error: "Passwords do not match",
    });
  }
});

// send password reset link in email
router.post(
  "/reset-password",
  checkStudentAlreadyLoggedIn,
  async (req, res) => {
    console.log(req.body.email, " ", req.body.cnic);
    const student = await Student.findOne({
      where: {
        email: req.body.email,
        cnic: req.body.cnic,
      },
    });
    if (student != null) {
      const key = randomstring.generate(255);
      PasswordResetLink.create({
        key: key,
        StudentId: student.id,
      });

      const reset_link =
        process.env.SITE_DOMAIN_NAME + "/set-new-password/" + key;
      console.log(reset_link);

      try {
        await queueMail(
          student.email,
          `Reset Password`,
          {
            heading: `Reset Password`,
            inner_text: `Dear Student
            <br>
            This email contains your password reset link. Either copy paste the following link in your browser:
            <br>
            <a href="${reset_link}">${reset_link}</a>
            <br>
            Sincerely, 
            IEC Admissions Team`,
            button_announcer:
              "Or you can click on the following button to change your password",
            button_text: "Change Password",
            button_link: reset_link,
          },
          true
        );
        res.render("templates/error.ejs", {
          additional_info: "Check Your Inbox",
          error_message:
            "If your email and CNIC were correct, then we have sent you a Password Reset link at your email address. Please also check your spam folder.",
          action_link: "/student/login",
          action_link_text: "Click here to go to the student login page.",
        });
      } catch (err) {
        console.log("Password reset email sending failed.", err);
        res.sendStatus(500);
      }
    } else {
      res.redirect("/student/forgot-password?error=wrong-credentials");
    }
  }
);

router.get("/feedback", checkStudentAuthenticated, (req, res) => {
  res.render("student/feedback/index.ejs", {
    user_type: req.user.type,
  });
});

router.get("/assignments", checkStudentAuthenticated, async (req, res) => {
  try {
    let assignments = await Assignment.findAll({
      where: {
        StudentId: req.user.user.id,
      },
      include: { model: Quiz, required: true, include: { model: Section } },
      order: [["id", "desc"]],
    });

    let count = 0;
    let result = [];
    result = await new Promise((resolve) => {
      for (let i = 0; i < assignments.length; i++) {
        assignments[i].Quiz.countSections().then(async (num_sections) => {
          result.push({
            quiz_id: assignments[i].Quiz.id,
            num_sections: num_sections,
            quiz_title: assignments[i].Quiz.title,
            createdAt: moment(assignments[i].createdAt).format("Do MMMM, YYYY"),
          });
          const cur_index = result.length - 1;

          const attempted_sections = await Attempt.findAndCountAll({
            where: {
              AssignmentId: assignments[i].id,
            },
          });

          result[cur_index].status = calculateSingleAssessmentStatus(
            attempted_sections,
            num_sections
          );
          count++;
          if (count == assignments.length) {
            resolve(result);
          }
        });
      }
    });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
