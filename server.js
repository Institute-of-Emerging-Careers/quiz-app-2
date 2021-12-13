const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const util = require("util");
const csv_parser = require("csv-parse");
const multer = require("multer");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("./passport-config.js");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const moment = require("moment");

// My requirements
const initializeDatabase = require("./db/initialize");
const checkAdminAuthenticated = require("./db/check-admin-authenticated");
const checkStudentAuthenticated = require("./db/check-student-authenticated");
const checkAdminAlreadyLoggedIn = require("./db/check-admin-already-logged-in");
const checkStudentAlreadyLoggedIn = require("./db/check-student-already-logged-in");
const { Quiz, Section, Question, Option } = require("./db/models/quizmodel.js");
const { User, Student, Invite, Assignment, Answer } = require("./db/models/user");
const { saveNewQuiz } = require("./functions/saveNewQuiz.js");
const { saveExistingQuiz, removeEverythingInQuiz } = require("./functions/saveExistingQuiz.js");
const csvToState = require("./functions/csvToState");
const deleteQuiz = require("./functions/deleteQuiz");
const saveQuizProgress = require("./functions/saveQuizProgress");
const calculateScore = require("./functions/calculateScore");
const updateStatus = require("./functions/sectionExistsInStatus");
const updateScore = require("./functions/updateScore") 
const millisecondsToMinutesAndSeconds = require("./functions/millisecondsToMinutesAndSeconds")
const { rejects } = require("assert");
const { resolve } = require("path");
const sequelize = require("./db/connect.js");

// Multer config for image upload
var img_storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: function (req, file, cb) {
    switch (file.mimetype) {
      case "image/jpeg":
        ext = ".jpeg";
        break;
      case "image/png":
        ext = ".png";
        break;
    }
    cb(null, file.originalname + "-" + Date.now() + ext);
  },
});

var img_upload = multer({ storage: img_storage });

// Multer config for csv file upload
var csv_storage = multer.diskStorage({
  destination: "./uploads/csv",
  filename: function (req, file, cb) {
    console.log(file.mimetype);
    switch (file.mimetype) {
      case "application/vnd.ms-excel":
        ext = ".csv";
        break;
    }
    cb(null, file.originalname + "-" + Date.now() + ext);
  },
});

var csv_upload = multer({ storage: csv_storage });

// dotenv
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// Middleware
app.set("view-engine", "ejs");
app.use(express.json());
app.use(express.static("resources"));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Initializing Stuff
initializePassport(passport);
initializeDatabase();

// Server starts
app.listen(process.env.PORT);

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/admin", checkAdminAuthenticated, async (req, res) => {
  try {
    const all_quizzes = await Quiz.findAll();
    for (let i = 0; i < all_quizzes.length; i++) {
      all_quizzes[i].num_sections = await all_quizzes[i].countSections();
      const all_sections = await all_quizzes[i].getSections();
      let total_questions = 0;
      for (let j = 0; j < all_sections.length; j++) {
        total_questions += await all_sections[j].countQuestions();
      }
      all_quizzes[i].num_questions = total_questions;
    }

    const all_invites = await Invite.findAll({include:[Quiz]});

    res.render("admin/index.ejs", {
      myname: req.user.user.firstName,
      user_type: req.user.type,
      all_quizzes: all_quizzes,
      all_invites: all_invites,
      site_domain_name: process.env.SITE_DOMAIN_NAME,
      moment: moment,
      query: req.query
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get("/new", checkAdminAuthenticated, (req, res) => {
  res.render("new_quiz.ejs", { quizId: "", user_type: req.user.type });
});

app.get("/edit/:quizId", checkAdminAuthenticated, (req, res) => {
  res.render("new_quiz.ejs", { quizId: req.params.quizId, user_type: req.user.type });
});

app.get("/admin/login", checkAdminAlreadyLoggedIn, (req, res) => {
  res.render("admin/login/index.ejs");
});

app.get("/invite/:link", checkStudentAlreadyLoggedIn, async (req, res) => {
  const invite = await Invite.findOne({
    where: {
      link: req.params.link,
    },
  });
  if (invite == null) {
    res.render("templates/error.ejs", {
      link: req.params.link,
      site_domain_name: process.env.SITE_DOMAIN_NAME,
      error_message: "The above invite link is invalid. Please contact IEC for a valid invite link.",
      action_link: "/",
      action_link_text: "Click here to go to home page.",
    });
  } else {
    res.render("student/signup/index.ejs", {
      link: req.params.link,
    });
  }
});

app.get("/quizState/:quizId", checkAdminAuthenticated, async (req, res) => {
  /*
  Target:
  [
    {
        sectionTitle: sectionInput,
        poolCount: 0,
        questions: [
            {
                statement: null,
                type: type,
                image:null,
                link:{url:null, text:null}
                options: [
                    { optionStatement: "option 1", correct: true},
                    { optionStatement: null, correct: false }
                ],
            }
        ],
    }
  ]
  */

  let stateObject = [];
  try {
    const quiz = await Quiz.findOne({
      where: {
        id: req.params.quizId,
      },
    });

    const sections = await quiz.getSections({
      order: [["sectionOrder", "ASC"]],
    });
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      stateObject.push({
        sectionTitle: sections[sectionIndex].title,
        sectionOrder: sections[sectionIndex].sectionOrder,
        poolCount: sections[sectionIndex].poolCount,
        time: sections[sectionIndex].time,
        questions: [],
      });

      const questions = await sections[sectionIndex].getQuestions({
        order: [["questionOrder", "ASC"]],
      });
      for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
        stateObject[sectionIndex].questions.push({
          statement: questions[questionIndex].statement,
          questionOrder: questions[questionIndex].questionOrder,
          image: questions[questionIndex].image,
          type: questions[questionIndex].type,
          marks: questions[questionIndex].marks,
          link: { url: questions[questionIndex].link_url, text: questions[questionIndex].link_text },
          options: [],
        });

        const options = await questions[questionIndex].getOptions({
          order: [["optionOrder", "ASC"]],
        });
        for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
          stateObject[sectionIndex].questions[questionIndex].options.push({
            optionStatement: options[optionIndex].statement,
            optionOrder: options[optionIndex].optionOrder,
            correct: options[optionIndex].correct,
            edit: options[optionIndex].statement == null ? true : false,
            image: options[optionIndex].image,
          });
        }
        stateObject[sectionIndex].questions[questionIndex].options.push({
          optionStatement: null,
          correct: false,
        });
      }
    }
    console.log(stateObject);

    res.json({ success: true, stateObject: stateObject, quizTitle: quiz.title });
  } catch (err) {
    res.json({ success: false });
  }
});

app.get("/quiz/duplicate/:quizId", checkAdminAuthenticated, async(req,res)=>{
  const old_quiz = await Quiz.findOne({where:{id:req.params.quizId}, attributes:["title"], 
    include: {model:Section, attributes: ["sectionOrder","title","poolCount","time"],
      include:{model: Question, attributes: ["questionOrder","statement","type","marks","image","link_url","link_text"],
        include: {model: Option, attributes: ["optionOrder","statement", "correct","image"]}   
    }}})

  const new_quiz = await Quiz.create({title:old_quiz.title + " - copy", modified_by: req.user.user.id})

  let count_created = 0;
  // target count
  let total_required = 0;

  await new Promise((resolve,reject)=>{
    total_required += old_quiz.Sections.length
    old_quiz.Sections.forEach(old_section=>{
      Section.create({sectionOrder:old_section.sectionOrder, title: old_section.title, poolCount: old_section.poolCount, time: old_section.time, QuizId: new_quiz.id})
      .then(new_section=>{
        count_created++
          console.log("SECTION: ",old_section.title)
          total_required += old_section.Questions.length
          old_section.Questions.forEach(old_question=>{
            console.log(old_question.statement)
            Question.create({SectionId: new_section.id, questionOrder: old_question.questionOrder, statement: old_question.statement, type: old_question.type, marks: old_question.marks, image: old_question.image, link_url: old_question.link_url, link_text: old_question.link_text})
            .then(new_question=>{
              count_created++
              total_required += old_question.Options.length
              old_question.Options.forEach(old_option=>{
                Option.create({QuestionId: new_question.id, optionOrder: old_option.optionOrder, statement: old_option.statement, correct: old_option.correct, image: old_option.image})
                .then(new_option=>{
                  count_created++
                  if (count_created == total_required) {
                    resolve()
                  }
                }).catch(err=>{
                  reject(err)
                }) 
              })
            }).catch(err=>{
              reject(err)
            })
          })
      }).catch(err=>{
        reject(err)
      })
    })
  })

  res.redirect("/admin")

})

app.get("/quiz/:quizId/details", checkStudentAuthenticated, async (req, res) => {
  try {
    async function retrieveStatus(assignments, sectionId) {
      const assignment = assignments[0];
      if (assignment.status != null) {
        return new Promise(async (resolve, reject) => {
          try {
            let status = assignment.status;
            for (let i = 0; i < status.length; i++) {
              if (status[i].sectionId == sectionId) {
                resolve(status[i].status);
              }
            }
            resolve("Not Started");
          } catch (err) {
            reject(err);
          }
        });
      } else {
        return null;
      }
    }

    let quiz = await Quiz.findOne({
      where: {
        id: req.params.quizId,
      },
      attributes: [],
      include: [
        { model: Section, attributes: ["id", "title", "poolCount", "time"] },
        {
          model: Assignment,
          where: {
            StudentId: req.user.user.id,
          },
          attributes: ["status", "sectionStatus"],
        },
      ],
    });


    let final_data = [];
    for (let i = 0; i < quiz.Sections.length; i++) {
      const section_id = quiz.Sections[i].id;
      const section_title = quiz.Sections[i].title;
      const section_time = quiz.Sections[i].time;
      const pool = quiz.Sections[i].poolCount;
      const status = await retrieveStatus(quiz.Assignments, quiz.Sections[i].id);
      final_data.push({ id: section_id, title: section_title, num_questions: pool, time: section_time, status: status });
    }
    res.json(final_data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/test",async (req,res)=>{
  const the_quiz = await Quiz.findOne()
  const t = await sequelize.transaction()
  removeEverythingInQuiz(the_quiz,t).then(()=>{
    res.send("HI")
    t.commit()
  })
  .catch((err)=>{
    console.log(err)
    res.send(err)
    t.rollback()
  })
})

app.get("/quiz/attempt/:quizId/section/:sectionId", checkStudentAuthenticated, async (req, res) => {
  // add check to see if quiz is available at this moment, if student is assigned to this quiz

  function addSectionToStatus(assignment, section, sectionId) {
    let cur_status = assignment.status;
    let cur_section_status = assignment.sectionStatus
    if (section.time != 0) {
      const startTime = Date.now();
      console.log("startTime", startTime);
      // converting section.time which is in minutes to milliseconds
      const endTime = startTime + section.time * 60 * 1000;
      console.log("endTime", endTime);



      let new_section_status = []
      if (cur_section_status != null) new_section_status = [...cur_section_status]
      new_section_status.push({ sectionId: sectionId, startTime: startTime, endTime: endTime });

      return updateStatus(assignment.id, cur_status, sectionId, "In Progress", new_section_status);
    } else {
      const startTime = Date.now();

      let new_section_status = []
      if (cur_section_status!=null) new_section_status = [...cur_section_status]
      new_section_status.push({ sectionId: sectionId, startTime: startTime, endTime: 0 });
      return updateStatus(assignment.id, cur_status, sectionId, "In Progress", new_section_status);
    }
  }

  // make this quiz non-editable because someone has started attempting it
  const quiz = await Quiz.findOne({
    where:{
      id: req.params.quizId
    }
  })
  await quiz.update({allow_edit: false})

  // set sectionStatus
  const assignment = await Assignment.findOne({
    where: {
      StudentId: req.user.user.id,
      QuizId: req.params.quizId,
    },
    include: [Quiz],
  });

  const section = await Section.findOne({
    where: {
      id: req.params.sectionId,
    },
  });

  if (assignment.sectionStatus == null) {
    await addSectionToStatus(assignment, section, req.params.sectionId);

    res.render("student/attempt.ejs", { user_type: req.user.type, sectionId: req.params.sectionId, sectionTitle: section.title, quizTitle: assignment.Quiz.title });
  } else {
    // assignment.sectionStatus is not null, which means that one of the sections of this quiz has been either started or finished

    try {
      const num_sections = await assignment.Quiz.countSections();
      const sectionStatus = assignment.sectionStatus;
      console.log("----Printing Section Status: ",sectionStatus);
      // see if sectionStatus already has current section
      let cur_section_found = false;
      for (let i = 0; i < sectionStatus.length; i++) {
        if (sectionStatus[i].sectionId == parseInt(req.params.sectionId)) {
          cur_section_found = true;
          if (sectionStatus[i].endTime != 0 && sectionStatus[i].endTime - Date.now() < 0) {
            // this means that the section is timed and the time for this section is already over
            res.send("The time for this section has ended. You cannot continue to attempt it anymore. <a href='/student'>Click here to go back.</a>");
          } else {
            res.render("student/attempt.ejs", { user_type: req.user.type, sectionId: req.params.sectionId, sectionTitle: section.title, quizTitle: assignment.Quiz.title });
          }
        }
      }
      // sectionStatus does not have current
      if (num_sections > sectionStatus.length && !cur_section_found) {
        // add this section to sectionStatus
        console.log("I'm here")
        await addSectionToStatus(assignment, section, req.params.sectionId);

        res.render("student/attempt.ejs", { user_type: req.user.type, sectionId: req.params.sectionId, sectionTitle: section.title, quizTitle: assignment.Quiz.title });
      }
    } catch (err) {
      console.log(err);
      res.send("Error 45");
    }
  }
});

app.get("/section/:sectionId/all-questions", checkStudentAuthenticated, async (req, res) => {
  // add check to see if quiz is available at this moment, if student is assigned to this quiz
  // if student has already solved this quiz, etc.
  let result = [];
  const section = await Section.findOne({
    where: {
      id: req.params.sectionId,
    },
    include: [{ model: Question, required: true, order: [["questionOrder", "asc"]] }],
  });

  const assignment = await Assignment.findOne({
    where: {
      StudentId: req.user.user.id,
      QuizId: section.QuizId,
    },
  });
  console.log("PoolCount:",section.poolCount)

  let count = 0;
  await new Promise((resolve, reject) => {
    for (let i = 0; i < section.poolCount; i++) {
      Option.findAll({ where: { QuestionId: section.Questions[i].id }, order: [["optionOrder", "asc"]] })
        .then(async (options_array) => {
          if (section.Questions[i].type == "MCQ-S") {
            const old_answer = await Answer.findOne({where:{StudentId: req.user.user.id, QuestionId: section.Questions[i].id}, attributes:["OptionId"]})
            if (old_answer == null)
              result.push({ question: section.Questions[i], options: options_array, answer: -1 });
            else
              result.push({ question: section.Questions[i], options: options_array, answer: old_answer.OptionId });
          }
          else if (section.Questions[i].type == "MCQ-M") {
            const old_answers = await Answer.findAll({where:{StudentId: req.user.user.id, QuestionId: section.Questions[i].id}, attributes:["OptionId"], order:[["OptionId","asc"]]})
            let default_answers_array = [] //all false
            if (old_answers == null) {
              options_array.forEach(opt=>{
                default_answers_array.push(false)
              })
            } else {
              options_array.forEach(opt=>{
                let found = false;
                old_answers.forEach(old_answer=>{
                  if (opt.id == old_answer.OptionId) {
                    found = true;
                  }
                })
                default_answers_array.push(found)
              })
            }
            result.push({ question: section.Questions[i], options: options_array, answer: default_answers_array });
          }
          count++;
          if (count == section.poolCount) resolve(result);
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    }
  });

  
  res.json({ success: true, data: result });
});

app.get("/section/:sectionId/endTime", checkStudentAuthenticated, async (req, res) => {
  // getting the endTime of this quiz
  try {
    const section = await Section.findOne({
      where: {
        id: req.params.sectionId,
      },
      include: [{ model: Question, required: true, order: [["questionOrder", "asc"]] }],
    });

    const assignment = await Assignment.findOne({
      where: {
        StudentId: req.user.user.id,
        QuizId: section.QuizId,
      },
      include: { model: Quiz, attributes: ["id"] },
    });

    const num_sections = await assignment.Quiz.countSections();

    const sectionStatus = assignment.sectionStatus;
    let endTime;
    for (let i = 0; i < sectionStatus.length; i++) {
      if (sectionStatus[i].sectionId == req.params.sectionId) {
        endTime = sectionStatus[i].endTime;
      }
    }

    if (endTime == undefined && num_sections > sectionStatus.length) {
      endTime = 0;
    }

    res.json({ success: true, endTime: endTime });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.post("/upload", img_upload.single("file"), (req, res) => {
  res.status(200).json({ status: true, filename: "/img/" + req.file.filename });
});

app.post("/quiz/save-progress", checkStudentAuthenticated, (req, res) => {
  // add check to see if student still is allowed to solve this quiz (depending on time)
  const answers = req.body.answers;

  saveQuizProgress(answers, req)
    .then(() => { 
      // time is time of submission
      res.json({ success: true, time: Date.now() });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

app.get("/quiz/attempt/:sectionId/score", checkStudentAuthenticated, async (req, res) => {
  
  if (req.query.hasOwnProperty("time")) {
    console.log("Time: ",req.query.time);
  }
  const quizId = (await Section.findOne({ where: { id: req.params.sectionId }, include: { model: Quiz, required: true, attributes: ["id"] }, attributes: [] })).Quiz.id;
  const assignment = await Assignment.findOne({ where: { StudentId: req.user.user.id, QuizId: quizId } });
  const score = await calculateScore(req.params.sectionId, req.user.user.id);
  let sectionStatus = assignment.sectionStatus;
  for (let i=0;i<sectionStatus.length;i++) {
    if (sectionStatus[i].sectionId == req.params.sectionId) {
        sectionStatus[i].duration = req.query.time - sectionStatus[i].startTime
        sectionStatus[i].endTime = Date.now()
    }
  }

  await updateScore(req.params.sectionId, assignment, score)

  await updateStatus(assignment.id, assignment.status, req.params.sectionId, "Completed", sectionStatus);

  res.json({ success: true });
});

app.get("/quiz/:quizId/results", checkAdminAuthenticated, async (req,res)=>{
  const quiz = await Quiz.findOne({where:{id:req.params.quizId}, include: [Section]})

  let data = []
  let assignments = await Assignment.findAll({where:{QuizId: req.params.quizId}, include: [Student]})

  assignments.forEach(assignment=>{
    if (assignment.scores != null) {
      for (let i=0;i<assignment.scores.length;i++) {
        quiz.Sections.forEach(section=>{
          if (assignment.scores[i].sectionId == section.id) {
            assignment.scores[i].sectionTitle = section.title
          }
        })
      }

      for (let i=0;i<assignment.sectionStatus.length;i++) {
        quiz.Sections.forEach(section=>{
          if (assignment.sectionStatus[i].sectionId == section.id) {
            assignment.sectionStatus[i].sectionTitle = section.title
          }
        })
      }
      data.push({
        student_name: assignment.Student.firstName + " " + assignment.Student.lastName,
        scores: assignment.scores,
        sectionStatus: assignment.sectionStatus
      })
    }
  })

  res.render("admin/view_results.ejs", {user_type: req.user.type, myname: req.user.user.firstName, quiz_title: quiz.title, data: data, moment:moment, millisecondsToMinutesAndSeconds:millisecondsToMinutesAndSeconds})
})

// This img_upload object is defined in this server.js file above
app.post("/upload/csv", checkAdminAuthenticated, csv_upload.single("file"), (req, res) => {
  csv_parser(fs.readFileSync(path.join(__dirname, "/uploads/csv/" + req.file.filename)), {}, (err, data) => {
    if (!err) {
      const state = csvToState(data);
      if (state !== false) {
        res.status(200).json({ status: true, state: state });
      } else {
        res.sendStatus(401);
      }
    } else {
      console.log(err);
      res.sendStatus(500);
    }
  });
});

app.post("/create-invite", checkAdminAuthenticated, async (req, res) => {
  if (req.body.quizId != null && req.body.url != null && req.body.url != "") {
    try {
      const new_invite = await Invite.create({ link: req.body.url, QuizId: req.body.quizId });
      if (new_invite != null) res.json({ success: true, message: "Link created successfully.", invite: new_invite });
      else res.json({ success: false, message: "Invite not created. There was an error." });
    } catch (err) {
      console.log(err);
      if (err.errors[0].type == "unique violation") {
        res.json({ success: false, message: "This link is already in use. Create a different one." });
      } else {
        res.json({ success: false, message: "An unexpected error has occured." });
      }
    }
  } else {
    res.json({ success: false, message: "Please enter a valid url." });
  }
});

app.get("/img/:filename", (req, res) => {
  var options = {
    root: path.join(__dirname, "uploads/images"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  res.sendFile(req.params.filename, options, function (err) {
    if (err) {
      console.log(err);
    }
  });
});

app.post(
  "/admin/login",
  passport.authenticate("admin-login", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })
);

app.post(
  "/login",
  passport.authenticate("student-login", {
    failureRedirect: "/student/login",
    failureFlash: true,
  }), async (req,res)=>{
    // successRedirect: "/student",
    if (req.hasOwnProperty('user')) {
      try {
        const invite = await Invite.findOne({where:{link:req.body.link}, include: {model:Quiz, attributes:["id"]}})
        const quizId = invite.Quiz.id
        await Assignment.create({StudentId: req.user.user.id, QuizId: quizId })
        res.redirect("/student")
      } catch(err) {
        res.redirect("/student/login")
      }
    }
  }
);

app.post("/student/signup", async (req, res) => {
  const firstName = req.body.firstName,
    lastName = req.body.lastName,
    email = req.body.email,
    phone = req.body.phone,
    cnic = req.body.cnic,
    password = req.body.password,
    invite_link = req.body.invite;

  try {
    const invite = await Invite.findOne({
      where: {
        link: invite_link,
      },
    });
    invite.increment("registrations");

    const student = await Student.create({ firstName: firstName, lastName: lastName, email: email, password: await bcrypt.hash(password, 10), phone: phone, cnic: cnic, InviteId: invite.id });

    // assign the quiz associated with the invite to this student
    const new_assignment = await Assignment.create({ StudentId: student.id, QuizId: invite.QuizId });

    res.redirect("/student/login");
  } catch (err) {
    console.log(err);
    if (err.errors) {
      res.redirect("/invite/" + invite_link + "?error=" + encodeURIComponent(err.errors[0].type));
    } else res.redirect("/invite/" + invite_link);
  }
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

app.post("/save-quiz", checkAdminAuthenticated, async (req, res) => {
  console.log(util.inspect(req.body.mcqs, false, null, true));
  if (req.body.quizId == null) {
    // if new quiz being created
    saveNewQuiz(req, res);
  } else {
    // if old quiz being updated
    console.log(req.body);
    const quiz = Quiz.findOne({
      where:{
        id: req.body.quizId
      }
    })
    if (quiz.allow_edit)
      saveExistingQuiz(req, res);
    else res.send({ message: "Quiz could not be edited. At least 1 student has already attempted it or is attempting it. Please duplicate the quiz and make changes to the new quiz.", status: false, quizId: quiz.id });
  }
});

app.get("/delete/quiz/:id", checkAdminAuthenticated, async (req, res) => {
  const t = await sequelize.transaction()
  try {
    await deleteQuiz(req.params.id, t);
    t.commit()
    res.redirect("/admin");
  } catch(err) {
    t.rollback()
    res.redirect("/admin?error=delete");
    console.log("Error deleting quiz.");
  }
});

app.get("/student", checkStudentAuthenticated, (req, res) => {
  console.log(req.query.success)
  res.render("student/index.ejs", { user_type: req.user.type, query: req.query });
});

app.get("/student/login", checkStudentAlreadyLoggedIn, (req, res) => {
  res.render("student/login/index.ejs", {link: req.query.link});
});

app.get("/student/assignments", checkStudentAuthenticated, async (req, res) => {
  try {
    let assignments = await Assignment.findAll({
      where: {
        StudentId: req.user.user.id,
      },
      include: { model: Quiz, required: true, include: { model: Section } },
    });
    let all_quizzes = [];

    // // add num_sections info to the returned object
    // await async.forEachOf(assignments, (assignment, index) => {
    //   assignment.Quiz.countSections().then((num_sections) => {
    //     assignments[index].Quiz.num_sections = num_sections;
    //   });
    // });

    let count = 0;
    let result = [];
    await new Promise((resolve) => {
      for (let i = 0; i < assignments.length; i++) {
        assignments[i].Quiz.countSections().then(async (num_sections) => {
          count++;
          const status = assignments[i].status == null ? null : assignments[i].status;
          result.push({ quiz: assignments[i].Quiz, num_sections: num_sections, status: status });
          if (count == assignments.length) {
            resolve();
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
