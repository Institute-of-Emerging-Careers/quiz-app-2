const express = require("express");
const app = express();
const path = require("path");
const compression = require("compression");
const fs = require("fs");
const csv_parser = require("csv-parse");
const passport = require("passport");
const flash = require("express-flash");
const session = require("cookie-session");
const initializePassport = require("./passport-config.js");
const cookieParser = require("cookie-parser");

// routes
const studentRouter = require("./routes/student");
const adminRouter = require("./routes/admin/admin");
const mailRouter = require("./routes/mail");
const quizRouter = require("./routes/quiz");
const applicationRouter = require("./routes/application");

// My requirements
const checkAdminAuthenticated = require("./db/check-admin-authenticated");
const checkStudentAlreadyLoggedIn = require("./db/check-student-already-logged-in");
const youtubePlaylistToCSV = require("./functions/youtube-playlist-to-csv");
const { Quiz } = require("./db/models/quizmodel.js");
const {
  Student,
  Invite,
  Assignment,
  PasswordResetLink,
  Email,
} = require("./db/models/user");
const csvToState = require("./functions/csvToState");

const { queueMail } = require("./bull");
const flatten2DArray = require("./functions/flatten2DArray");
const sendFileInResponse = require("./functions/sendFileInResponse");
const stateToCSV = require("./functions/stateToCSV.js");

const sequelize = require("./db/connect.js");
const resetStudentAssignment = require("./functions/resetStudentAssignment.js");

// multer
const { file_upload, csv_upload } = require("./multer-config");

// starting cron-jobs
const {
  assessment_reminder_mailer_task,
  score_past_deadline_attempts,
} = require("./functions/cron-ping");

// assessment_reminder_mailer_task.start();
// score_past_deadline_attempts.start();

// dotenv
require("dotenv").config();

// Middleware
app.set("view-engine", "ejs");
app.use(express.json({ limit: "50mb" }));
app.use(express.static("resources"));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(flash());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Cookie Options
    maxAge: 3 * 24 * 60 * 60 * 1000, // 72 hours
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

// routing middleware
app.use("/student", studentRouter);
app.use("/admin", adminRouter);
app.use("/mail", mailRouter);
app.use("/quiz", quizRouter);
app.use("/application", applicationRouter);

// Initializing Stuff
initializePassport(passport);

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/invite/:link", checkStudentAlreadyLoggedIn, async (req, res) => {
  const invite = await Invite.findOne({
    where: {
      link: req.params.link,
    },
  });
  if (invite == null) {
    res.render("templates/error.ejs", {
      additional_info:
        "https://" +
        process.env.SITE_DOMAIN_NAME +
        "/invite/" +
        req.params.link,
      error_message:
        "The above invite link is invalid. Please contact IEC for a valid invite link.",
      action_link: "/",
      action_link_text: "Click here to go to home page.",
    });
  } else {
    res.render("student/signup/index.ejs", {
      link: req.params.link,
      query: req.query,
    });
  }
});

app.get("/test", async (req, res) => {
  try {
    await queueMail("22100063@lums.edu.pk", `Assessment Completed`, {
      heading: `All Sections Completed`,
      inner_text: `Dear Student
        <br>
        This email confirms that you have successfully solved the IEC Assessment. You'll now have to wait to hear back from us after the shortlisting process.
        <br>
        Thank you for showing your interest in becoming part of the program. 
        <br>
        Sincerely, 
        IEC Admissions Team`,
      button_announcer: "Visit out website to learn more about us",
      button_text: "Visit",
      button_link: "https://iec.org.pk",
    });
    console.log("Email sent");
    res.sendStatus(200);
  } catch (err) {
    console.log("Email sending failed.", err);
    res.sendStatus(500);
  }
});

app.post("/upload", file_upload.single("file"), (req, res) => {
  console.log("uploading file");
  const file_type = req.file.mimetype.slice(0, 5);
  let file_name = "";
  if (file_type == "image") file_name = "/img/";
  else if (file_type == "audio") file_name = "/audio/";

  let response_object = {
    status: true,
    filename: file_name + req.file.filename,
  };
  res.status(200).json(response_object);
});

// CSV for Quiz State upload
app.post(
  "/upload/quiz/csv",
  checkAdminAuthenticated,
  csv_upload.single("file"),
  (req, res) => {
    csv_parser(
      fs.readFileSync(
        path.join(__dirname, "/uploads/csv/" + req.file.filename)
      ),
      {},
      (err, data) => {
        if (!err) {
          const obj = csvToState(data);
          if (obj !== false) {
            res
              .status(200)
              .json({ status: true, state: obj[0], passages: obj[1] });
          } else {
            res.sendStatus(401);
          }
        } else {
          console.log(err);
          res.sendStatus(500);
        }
      }
    );
  }
);

app.post(
  "/upload/email/csv",
  checkAdminAuthenticated,
  csv_upload.single("file"),
  (req, res) => {
    csv_parser(
      fs.readFileSync(
        path.join(__dirname, "/uploads/csv/" + req.file.filename)
      ),
      {},
      async (err, data) => {
        // deleting file because it is not needed anymore
        fs.unlink(
          path.join(__dirname, "/uploads/csv/" + req.file.filename),
          () => {
            if (!err) {
              /* data = [
            ["Emails"],
            ["rohanhussain1@yahoo.com"],
            ["dkhn.act@gmail.com"],
            ["22100063@lums.edu.pk"]    
          ] */
              data = flatten2DArray(data);
              res.status(200).json(data);
            } else {
              console.log(err);
              res.sendStatus(500);
            }
          }
        );
      }
    );
  }
);

app.post("/state-to-csv", checkAdminAuthenticated, async (req, res) => {
  const [mcqs, passages] = req.body;
  let file_name = await stateToCSV(mcqs, passages);
  if (file_name === false) res.json({ status: false });
  else {
    res.json({
      status: true,
      file_link: process.env.SITE_DOMAIN_NAME + "/csv/" + file_name,
    });
  }
});

app.get(
  "/reset-assignment/student/:student_id/quiz/:quiz_id",
  checkAdminAuthenticated,
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      await resetStudentAssignment(
        req.params.student_id,
        req.params.quiz_id,
        t
      );
      t.commit();
      res.render("templates/error.ejs", {
        additional_info: "Assignment Reset Successfully",
        error_message:
          "Successfully reset the student's assignment status. Please ask the student to login using the already set email and password. The student will see a fresh assignment ready to be solved.",
        action_link: "/admin",
        action_link_text: "Return to Admin Panel",
      });
    } catch (err) {
      t.rollback();
      res.render("templates/error.ejs", {
        additional_info: "Assignment Reset Failed :(",
        error_message:
          "Could not reset the student's assignment status. Please Contact the IT Team.",
        action_link: "/admin",
        action_link_text: "Return to Admin Panel",
      });
    }
  }
);

app.get("/img/:filename", (req, res) => {
  sendFileInResponse(req, res, "uploads/images");
});

app.get("/audio/:filename", (req, res) => {
  sendFileInResponse(req, res, "uploads/audio");
});

app.get("/csv/:filename", (req, res) => {
  sendFileInResponse(req, res, "downloads/csv");
});

app.post(
  "/login",
  passport.authenticate("student-login", {
    failureRedirect: "/student/login",
    failureFlash: true,
  }),
  async (req, res) => {
    // successRedirect: "/student",
    if (req.hasOwnProperty("user")) {
      try {
        if (req.body.link != "") {
          const invite = await Invite.findOne({
            where: { link: req.body.link },
            include: { model: Quiz, attributes: ["id"] },
          });
          const quizId = invite.Quiz.id;
          await Assignment.findOrCreate({
            where: { StudentId: req.user.user.id, QuizId: quizId },
          });
        }
        if (req.body.redirect != "") res.redirect(req.body.redirect);
        else res.redirect("/student");
      } catch (err) {
        console.log(err);
        res.redirect("/student/login");
      }
    } else {
      console.log("hey");
    }
  }
);

app.get("/email/get/:email_id", checkAdminAuthenticated, async (req, res) => {
  try {
    const email = await Email.findOne({ where: { id: req.params.email_id } });
    if (email != null) {
      res.json(email);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/email-exists/:email", async (req, res) => {
  if ((await Student.count({ where: { email: req.params.email } })) > 0)
    res.send(true);
  else res.send(false);
});

app.get("/cnic-exists/:cnic", async (req, res) => {
  if ((await Student.count({ where: { cnic: req.params.cnic } })) > 0)
    res.send(true);
  else res.send(false);
});

app.get("/logout", (req, res) => {
  if (req.hasOwnProperty("user")) {
    const user_type = req.user.type;
    req.logOut();
    if (user_type == "admin") res.redirect("/admin/login");
    else res.redirect("/student/login");
  } else {
    res.redirect("/");
  }
});

app.get("/set-new-password/:key", async (req, res) => {
  const password_reset_link = await PasswordResetLink.findOne({
    where: {
      key: req.params.key,
    },
  });

  if (password_reset_link != null) {
    res.render("student/login/set_new_password.ejs", {
      key: req.params.key,
      student_id: password_reset_link.StudentId,
      error: false,
    });
  } else {
    res.render("templates/error.ejs", {
      additional_info: "Wrong Link",
      error_message:
        "The password reset link is invalid. Please go to the Student Login Page and click on Forgot Password to generate a valid link.",
      action_link: "/student/login",
      action_link_text: "Student Login Page",
    });
  }
});

app.get("/email-template", (req, res) => {
  res.render("templates/mail-template-1.ejs", {
    heading: `All Sections Completed`,
    inner_text: `Dear Student
    <br>
    This email confirms that you have successfully solved the IEC Assessment. You'll now have to wait to hear back from us after the shortlisting process.
    <br>
    Thank you for showing your interest in becoming part of the program. 
    <br>
    Sincerely, 
    IEC Admissions Team`,
    button_announcer: "Visit out website to learn more about us",
    button_text: "Visit",
    button_link: "https://iec.org.pk",
  });
});

app.get("/youtube/csv", (req, res) => {
  res.render("youtube-csv.ejs");
});

app.get("/youtube/csv/download", (req, res) => {
  youtubePlaylistToCSV(req.query.access_token, req.query.playlist_id).then(
    (file_name) => {
      res.redirect(`/csv/${file_name}`);
    }
  );
});

module.exports = app;
