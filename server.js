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
const csvStringify = require("csv-stringify");

// My requirements
const initializeDatabase = require("./db/initialize");
const checkAdminAuthenticated = require("./db/check-admin-authenticated");
const checkStudentAuthenticated = require("./db/check-student-authenticated");
const checkAdminAlreadyLoggedIn = require("./db/check-admin-already-logged-in");
const checkAnyoneAuthenticated = require("./db/check-anyone-authenticated")
const checkStudentAlreadyLoggedIn = require("./db/check-student-already-logged-in");
const {
  Quiz,
  Section,
  Question,
  Option,
  Passage,
} = require("./db/models/quizmodel.js");
const {
  User,
  Student,
  Invite,
  Assignment,
  Answer,
  Attempt,
  Score,
} = require("./db/models/user");
const { saveNewQuiz } = require("./functions/saveNewQuiz.js");
const {
  saveExistingQuiz,
  removeEverythingInQuiz,
} = require("./functions/saveExistingQuiz.js");
const calculateSingleAssessmentStatus = require("./functions/calculateSingleAssessmentStatus");
const csvToState = require("./functions/csvToState");
const deleteQuiz = require("./functions/deleteQuiz");
const saveQuizProgress = require("./functions/saveQuizProgress");
const calculateScore = require("./functions/calculateScore");
const setSectionStatusToInProgress = require("./functions/setSectionStatusToInProgress");
const {sendTextMail, sendHTMLMail} = require("./functions/sendEmail")
const {
  setSectionStatusToComplete,
} = require("./functions/setSectionStatusToComplete");
const updateScore = require("./functions/updateScore");
const getAssignment = require("./db/getAssignment");
const getSection = require("./db/getSection");
const millisecondsToMinutesAndSeconds = require("./functions/millisecondsToMinutesAndSeconds");
const { rejects } = require("assert");
const { resolve } = require("path");
const sequelize = require("./db/connect.js");
const roundToTwoDecimalPlaces = require("./functions/roundToTwoDecimalPlaces.js");
const stateToCSV = require("./functions/stateToCSV.js");

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
require("dotenv").config();

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

    const all_invites = await Invite.findAll({ include: [Quiz] });

    res.render("admin/index.ejs", {
      myname: req.user.user.firstName,
      user_type: req.user.type,
      all_quizzes: all_quizzes,
      all_invites: all_invites,
      site_domain_name: process.env.SITE_DOMAIN_NAME,
      moment: moment,
      query: req.query,
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get("/new", checkAdminAuthenticated, (req, res) => {
  res.render("new_quiz.ejs", { quizId: "", user_type: req.user.type });
});

app.get("/edit/:quizId", checkAdminAuthenticated, (req, res) => {
  res.render("new_quiz.ejs", {
    quizId: req.params.quizId,
    user_type: req.user.type,
  });
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
                passage: null,
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

  function findAndReturnPassageIndexFromPassagesArrayUsingPassageId(
    passages_object,
    passage_db_id
  ) {
    for (
      let passage_index = 0;
      passage_index < passages_object.length;
      passage_index++
    ) {
      if (passages_object[passage_index].id == passage_db_id)
        return passage_index;
    }
    return null;
  }

  let passages_object = [];
  try {
    const data = await Quiz.findOne({
      where: {
        id: req.params.quizId,
      },
      include: [
        {
          model: Section,
          attributes: ["id"],
          include: [
            {
              model: Question,
              attributes: ["id"],
              include: [
                {
                  model: Passage,
                  order: [["place_after_question", "ASC"]],
                },
              ],
            },
          ],
        },
      ],
    });

    data.Sections.forEach((section) => {
      section.Questions.forEach((question) => {
        if (question.Passage != null)
          passages_object.push({
            id: question.Passage.id,
            statement: question.Passage.statement,
            place_after_question: question.Passage.place_after_question,
          });
      });
    });
  } catch (err) {
    console.log(err);
  }

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
      for (
        let questionIndex = 0;
        questionIndex < questions.length;
        questionIndex++
      ) {
        stateObject[sectionIndex].questions.push({
          passage:
            questions[questionIndex].PassageId != null
              ? findAndReturnPassageIndexFromPassagesArrayUsingPassageId(
                  passages_object,
                  questions[questionIndex].PassageId
                )
              : null,
          statement: questions[questionIndex].statement,
          questionOrder: questions[questionIndex].questionOrder,
          image: questions[questionIndex].image,
          type: questions[questionIndex].type,
          marks: questions[questionIndex].marks,
          link: {
            url: questions[questionIndex].link_url,
            text: questions[questionIndex].link_text,
          },
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

    res.json({
      success: true,
      stateObject: stateObject,
      passages_object: passages_object,
      quizTitle: quiz.title,
    });
  } catch (err) {
    res.json({ success: false });
  }
});

app.get(
  "/quiz/duplicate/:quizId",
  checkAdminAuthenticated,
  async (req, res) => {
    const old_quiz = await Quiz.findOne({
      where: { id: req.params.quizId },
      include: {
        model: Section,
        include: {
          model: Question,
          include: [Option, Passage],
        },
      },
    });

    const t = await sequelize.transaction();

    const new_quiz = await Quiz.create(
      {
        title: old_quiz.title + " - copy",
        modified_by: req.user.user.id,
      },
      { transaction: t }
    );

    let count_created = 0; //total entities that have been created at a given time
    let total_required = 0; //total entities that exist in this quiz

    await new Promise((resolve, reject) => {
      total_required += old_quiz.Sections.length;
      old_quiz.Sections.forEach((old_section) => {
        Section.create(
          {
            sectionOrder: old_section.sectionOrder,
            title: old_section.title,
            poolCount: old_section.poolCount,
            time: old_section.time,
            QuizId: new_quiz.id,
          },
          { transaction: t }
        )
          .then((new_section) => {
            count_created++;
            total_required += old_section.Questions.length;
            old_section.Questions.forEach(async (old_question) => {
              let new_passage_id = null;
              if (old_question.Passage != null) {
                let old_passage = await old_question.getPassage();
                new_passage_id = (
                  await Passage.create(
                    {
                      statement: old_passage.statement,
                      place_after_question: old_passage.place_after_question,
                    },
                    { transaction: t }
                  )
                ).id;
              }
              Question.create(
                {
                  PassageId: new_passage_id,
                  SectionId: new_section.id,
                  questionOrder: old_question.questionOrder,
                  statement: old_question.statement,
                  type: old_question.type,
                  marks: old_question.marks,
                  image: old_question.image,
                  link_url: old_question.link_url,
                  link_text: old_question.link_text,
                },
                { transaction: t }
              )
                .then((new_question) => {
                  count_created++;
                  total_required += old_question.Options.length;
                  old_question.Options.forEach((old_option) => {
                    Option.create(
                      {
                        QuestionId: new_question.id,
                        optionOrder: old_option.optionOrder,
                        statement: old_option.statement,
                        correct: old_option.correct,
                        image: old_option.image,
                      },
                      { transaction: t }
                    )
                      .then(async (new_option) => {
                        count_created++;
                        if (count_created == total_required) {
                          resolve();
                          await t.commit();
                        }
                      })
                      .catch(async (err) => {
                        reject(err);
                        await t.rollback();
                      });
                  });
                })
                .catch(async (err) => {
                  reject(err);
                  await t.rollback();
                });
            });
          })
          .catch(async (err) => {
            reject(err);
            await t.rollback();
          });
      });
    });

    res.redirect("/admin");
  }
);

app.get(
  "/quiz/:quizId/details",
  checkStudentAuthenticated,
  async (req, res) => {
    try {
      async function retrieveStatus(assignments, sectionId) {
        const assignment = assignments[0];
        const attempt = await Attempt.findOne({
          where: {
            AssignmentId: assignment.id,
            SectionId: sectionId,
          },
        });
        console.log(attempt);
        if (attempt == null) return ["Not Started", "Start"];
        else if (attempt.statusText == "In Progress")
          return ["In Progress", "Continue"];
        else if (attempt.statusText == "Completed") return ["Completed", ""];
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
            attributes: ["id"],
          },
        ],
      });

      let final_data = [];
      for (let i = 0; i < quiz.Sections.length; i++) {
        const section_id = quiz.Sections[i].id;
        const section_title = quiz.Sections[i].title;
        const section_time = quiz.Sections[i].time;
        const pool = quiz.Sections[i].poolCount;
        const status = await retrieveStatus(
          quiz.Assignments,
          quiz.Sections[i].id
        );
        final_data.push({
          id: section_id,
          title: section_title,
          num_questions: pool,
          time: section_time,
          status: status,
        });
      }
      res.json(final_data);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

app.get("/test", async(req, res) => {
  try {
    await sendHTMLMail("rohanhussain1@yahoo.com", `Welcome to IEC LCMS`, 
        { 
            heading: 'Welcome to the IEC LCMS',
            inner_text: "We have sent you an assessment to solve. You have 72 hours to solve the assessment.",
            button_announcer: "Click on the button below to solve the Assessment",
            button_text: "Solve Assessment",
            button_link: "https://apply.iec.org.pk/student/login"
        }
    )
    console.log("Email sent")
    res.sendStatus(200)
  } catch(err) {
      console.log("Email sending failed.", err)
      res.sendStatus(500)
  }
});

app.get(
  "/quiz/attempt/:quizId/section/:sectionId",
  checkStudentAuthenticated,
  async (req, res) => {
    // getAssignment(studentId, quizId, [what_other_models_to_include_in_results])
    const assignment = await getAssignment(
      req.user.user.id,
      req.params.quizId,
      [Quiz]
    );

    // make this quiz non-editable because someone (this user) has started attempting it
    await assignment.Quiz.update({ allow_edit: false });

    // Get the section that the student wants to attempt.
    // getSection(sectionId, [what_other_models_to_include_in_results])
    const section = await getSection(req.params.sectionId, []);

    const sections_attempted = await Attempt.count({
      where: {
        AssignmentId: assignment.id,
        SectionId: req.params.sectionId,
      },
    });

    if (sections_attempted.count == 0) {
      //student hasn't attempted any sections previously, which means we don't need to check whether or not the student has attempted this section before

      // update the assignment's status and sectionStatus to show that this student has now started solving this section
      await setSectionStatusToInProgress(
        assignment,
        section,
        req.params.sectionId
      );

      res.render("student/attempt.ejs", {
        user_type: req.user.type,
        sectionId: req.params.sectionId,
        sectionTitle: section.title,
        quizTitle: assignment.Quiz.title,
        previewOrNot: 0
      });
    } else {
      // means that one or more of the sections of this quiz has been either started or have been finished

      try {
        // check if an Attempt exists for this section (that would mean that this user is currently attempting or has attempted this section)
        // An Attempt is characterized by an AssignmentId and a SectionId
        const attempt = await Attempt.findOne({
          where: {
            AssignmentId: assignment.id,
            SectionId: section.id,
          },
        });

        if (attempt != null) {
          if (attempt.endTime != 0 && attempt.endTime - Date.now() <= 100) {
            // this means that the section is timed and the time for this section is already over
            res.render("templates/error.ejs", {
              error_message:
                "The time for this section has ended. You cannot continue to attempt it anymore.",
              action_link: "/student",
              action_link_text: "Click here to go to student home page.",
            });
          } else {
            // the student still has time to continue this section
            res.render("student/attempt.ejs", {
              user_type: req.user.type,
              sectionId: req.params.sectionId,
              sectionTitle: section.title,
              quizTitle: assignment.Quiz.title,
              previewOrNot: 0
            });
          }
        } else {
          // the student has never attempted or started to attempt this section before

          // add this section to sectionStatus
          await setSectionStatusToInProgress(
            assignment,
            section,
            req.params.sectionId
          );

          res.render("student/attempt.ejs", {
            user_type: req.user.type,
            sectionId: req.params.sectionId,
            sectionTitle: section.title,
            quizTitle: assignment.Quiz.title,
            previewOrNot: 0
          });
        }
      } catch (err) {
        console.log(err);
        res.send("Error 45. Contact Admin.");
      }
    }
  }
);

app.get(
  "/quiz/preview/:quizId/section/:sectionId",
  checkAdminAuthenticated,
  async (req, res) => {
    
    // Get the section that the student wants to attempt.
    // getSection(sectionId, [what_other_models_to_include_in_results])
    const quiz = await Quiz.findOne({
      where: {
        id: req.params.quizId,
      },
      attributes: ["title"],
      include: {model:Section, where: {id: req.params.sectionId}, attributes: ["title"], limit:1}
  })

    try {
      res.render("student/attempt.ejs", {
        user_type: req.user.type,
        sectionId: req.params.sectionId,
        sectionTitle: quiz.Sections[0].title,
        quizTitle: quiz.title,
        previewOrNot: 1
      });
    } catch(err) {
      console.log(err)
      res.sendStatus(500)
    }
  }
);

app.get(
  "/section/:sectionId/all-questions",
  checkAnyoneAuthenticated,
  async (req, res) => {
    // add check to see if quiz is available at this moment, if student is assigned to this quiz
    // if student has already solved this quiz, etc.

    let section = await Section.findOne({
      where: {
        id: req.params.sectionId,
      },
      include: [
        {
          model: Question,
          required: true,
          order: [["questionOrder", "asc"]],
          include: [Passage],
        },
      ],
    });

    // constructing a results array to send
    let result = [];
    let passages = [];

    let prev_passage = null;
    let prev_passage_index = null;
    let passage_id_to_array_index_mapping = {};

    for (let i = 0; i < section.poolCount; i++) {
      if (section.Questions[i].Passage != null) {
        if (prev_passage != section.Questions[i].Passage.id) {
          prev_passage = section.Questions[i].Passage.id;
          prev_passage_index = passages.push({
            id: section.Questions[i].Passage.id,
            statement: section.Questions[i].Passage.statement,
            place_after_question:
              section.Questions[i].Passage.place_after_question,
          });

          prev_passage_index--;
          passage_id_to_array_index_mapping[section.Questions[i].Passage.id] =
            prev_passage_index;
        }
      }
    }

    // adding questions right now so that their order does not get messed up due to out-of-order fulfilment of promises in the loop below
    for (let i = 0; i < section.poolCount; i++) {
      result.push({
        question: {
          id: section.Questions[i].id,
          questionOrder: section.Questions[i].questionOrder,
          statement: section.Questions[i].statement,
          type: section.Questions[i].type,
          marks: section.Questions[i].marks,
          image: section.Questions[i].image,
          link_url: section.Questions[i].link_url,
          link_text: section.Questions[i].link_text,
          passage: passage_id_to_array_index_mapping.hasOwnProperty(
            section.Questions[i].PassageId
          )
            ? passage_id_to_array_index_mapping[section.Questions[i].PassageId]
            : null,
        },
        options: [],
        answer: -1,
      });
    }

    let count = 0;
    await new Promise((resolve, reject) => {
      for (let i = 0; i < section.poolCount; i++) {
        Option.findAll({
          where: { QuestionId: section.Questions[i].id },
          order: [["optionOrder", "asc"]],
        })
          .then(async (options_array) => {
            if (section.Questions[i].type == "MCQ-S") {
              // student may have already attempted this quiz partly, so we are getting his/her old answer
              const old_answer = await Answer.findOne({
                where: {
                  StudentId: req.user.user.id,
                  QuestionId: section.Questions[i].id,
                },
                attributes: ["OptionId"],
              });

              result[i].options = options_array;
              if (old_answer != null) result[i].answer = old_answer.OptionId;
            } else if (section.Questions[i].type == "MCQ-M") {
              const old_answers = await Answer.findAll({
                where: {
                  StudentId: req.user.user.id,
                  QuestionId: section.Questions[i].id,
                },
                attributes: ["OptionId"],
                order: [["OptionId", "asc"]],
              });
              let default_answers_array = []; //all false
              if (old_answers == null) {
                options_array.forEach((opt) => {
                  default_answers_array.push(false);
                });
              } else {
                options_array.forEach((opt) => {
                  let found = false;
                  old_answers.forEach((old_answer) => {
                    if (opt.id == old_answer.OptionId) {
                      found = true;
                    }
                  });
                  default_answers_array.push(found);
                });
              }
              result[i].options = options_array;
              result[i].answer = default_answers_array;
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

    res.json({ success: true, data: result, passages: passages });
  }
);

app.get(
  "/section/:sectionId/endTime",
  checkStudentAuthenticated,
  async (req, res) => {
    // getting the endTime of this quiz
    try {
      const section = await Section.findOne({
        where: {
          id: req.params.sectionId,
        },
        attributes: ["id", "QuizId"],
      });

      const assignment = await Assignment.findOne({
        where: {
          StudentId: req.user.user.id,
          QuizId: section.QuizId,
        },
        attributes: ["id"],
      });

      const attempt = await Attempt.findOne({
        where: { AssignmentId: assignment.id, SectionId: req.params.sectionId },
        attributes: ["endTime"],
      });
      let endTime = attempt.endTime;
      console.log("endTime: ", endTime);
      if (attempt.endTime == null) {
        endTime = 0;
      }

      res.json({ success: true, endTime: endTime });
    } catch (err) {
      console.log(err);
      res.json({ success: false });
    }
  }
);

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

app.get(
  "/quiz/attempt/:sectionId/score",
  checkStudentAuthenticated,
  async (req, res) => {
    const quizId = (
      await Section.findOne({
        where: { id: req.params.sectionId },
        include: { model: Quiz, required: true, attributes: ["id"] },
        attributes: [],
      })
    ).Quiz.id;
    const assignment = await Assignment.findOne({
      where: { StudentId: req.user.user.id, QuizId: quizId },
    });
    const score = await calculateScore(req.params.sectionId, req.user.user.id);

    await updateScore(req.params.sectionId, assignment, score);

    await setSectionStatusToComplete(assignment.id, req.params.sectionId);

    res.json({ success: true });
  }
);

app.get("/quiz/:quizId/results", checkAdminAuthenticated, async (req, res) => {
  const quiz = await Quiz.findOne({
    where: { id: req.params.quizId },
    include: [{ model: Section, order: ["id"] }],
  });

  // column_headings will tell the result page how many sections this quiz had, so that the displayed table has the right header row
  let quiz_sections = [];
  let quiz_total_score = 0;
  await new Promise((resolve) => {
    let count = 0;
    quiz.Sections.forEach(async (section, index) => {
      // get the maximum achievable (total) score of a section
      const maximum_score = (
        await Question.findAll({
          where: {
            SectionId: section.id,
          },
          attributes: [
            [sequelize.fn("SUM", sequelize.col("marks")), "total_marks"],
          ],
        })
      )[0].dataValues.total_marks;
      quiz_total_score += maximum_score;
      quiz_sections.push({
        section_id: section.id,
        section_title: section.title,
        maximum_score: maximum_score,
        maximum_time:
          section.time == 0
            ? "(Unlimited Time Allowed)"
            : "(out of " + section.time + " minutes)",
      });
      count++;
      if (count == quiz.Sections.length) resolve();
    });
  });

  let data = [];
  let assignments = await Assignment.findAll({
    where: { QuizId: req.params.quizId },
    include: [
      Student,
      { model: Attempt, include: [{ model: Section, order: ["id"] }, Score] },
    ],
  });

  assignments.forEach((assignment) => {
    if (assignment.Attempts.length > 0) {
      // only show scores of students who have attempted this quiz
      data.push({
        student_id: assignment.Student.id,
        student_name:
          assignment.Student.firstName + " " + assignment.Student.lastName,
        sections: [],
        total_score: 0,
        maximum_total_score: 0,
        percentage_total: 0,
      });

      quiz_sections.forEach((section) => {
        let found = false;
        assignment.Attempts.forEach((attempt) => {
          // if we simply start pushing each section attempt to the data array, and if the student has only attempted 1 of 2 sections,
          // then the results page will have to deal with the complex task of checking which section's results we have sent
          // and which we haven't for each student. So we will rather do it here. We will, for each section of the quiz that exists in the quiz,
          // check whether or not the student has attempted it. If yes, we push the scores to the data array, otherwise
          // we push "Not Attempted Yet" to the data array. The resulting array has sections in the same order as the quiz_sections
          // array
          if (section.section_id == attempt.SectionId) {
            const percentage_score = roundToTwoDecimalPlaces(
              ((attempt.Score == null ? 0 : attempt.Score.score) /
                section.maximum_score) *
                100
            );
            const section_score =
              attempt.Score == null ? 0 : attempt.Score.score;

            data[data.length - 1].sections.push({
              status: "Attempted",
              section_id: attempt.SectionId,
              section_score: section_score,
              percentage_score: percentage_score,
              start_time: attempt.startTime,
              end_time: attempt.endTime,
              duration: attempt.duration,
            });
            console.log();
            found = true;
            data[data.length - 1].total_score += section_score;
          }
        });
        if (!found)
          data[data.length - 1].sections.push({
            status: "Not Attempted yet",
            section_score: 0,
            percentage_score: 0,
            start_time: 0,
            end_time: 0,
            duration: 0,
          });
        else
          data[data.length - 1].percentage_total = roundToTwoDecimalPlaces(
            (data[data.length - 1].total_score / quiz_total_score) * 100
          );
      });
    }
  });

  let final_response = {
    quiz_sections: quiz_sections,
    data: data,
    quiz_total_score: quiz_total_score,
  };

  res.render("admin/view_results.ejs", {
    user_type: req.user.type,
    myname: req.user.user.firstName,
    quiz_title: quiz.title,
    data_obj: final_response,
    moment: moment,
    millisecondsToMinutesAndSeconds: millisecondsToMinutesAndSeconds,
  });
});

// CSV upload
app.post(
  "/upload/csv",
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

app.post("/create-invite", checkAdminAuthenticated, async (req, res) => {
  if (req.body.quizId != null && req.body.url != null && req.body.url != "") {
    try {
      const new_invite = await Invite.create({
        link: req.body.url,
        QuizId: req.body.quizId,
      });
      if (new_invite != null)
        res.json({
          success: true,
          message: "Link created successfully.",
          invite: new_invite,
        });
      else
        res.json({
          success: false,
          message: "Invite not created. There was an error.",
        });
    } catch (err) {
      console.log(err);
      if (err.errors[0].type == "unique violation") {
        res.json({
          success: false,
          message: "This link is already in use. Create a different one.",
        });
      } else {
        res.json({
          success: false,
          message: "An unexpected error has occured.",
        });
      }
    }
  } else {
    res.json({ success: false, message: "Please enter a valid url." });
  }
});

app.get("/registrations/:link", checkAdminAuthenticated, async (req, res) => {
  const invite = await Invite.findOne({
    where: { link: req.params.link },
    attributes: ["id"],
    include: [
      {
        model: Student,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "phone",
          "cnic",
          "createdAt",
        ],
      },
      Quiz,
    ],
  });

  await new Promise((resolve) => {
    let count = 0;
    invite.Students.forEach(async (student, index) => {
      const assignment = await Assignment.findOne({
        where: { StudentId: student.id, QuizId: invite.Quiz.id },
      });
      const num_sections = await invite.Quiz.countSections();
      const attempted_sections = await Attempt.findAndCountAll({
        where: { AssignmentId: assignment.id },
      });
      const [status, action] = calculateSingleAssessmentStatus(
        attempted_sections,
        num_sections
      );
      invite.Students[index].status = status;
      count++;
      if (count == invite.Students.length) resolve();
    });
  });

  res.render("admin/view_registrations.ejs", {
    user_type: req.user.type,
    students: invite.Students,
    full_link: process.env.SITE_DOMAIN_NAME + "/" + req.params.link,
  });
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

app.get("/csv/:filename", (req, res) => {
  var options = {
    root: path.join(__dirname, "downloads/csv"),
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
  }),
  async (req, res) => {
    // successRedirect: "/student",
    if (req.hasOwnProperty("user")) {
      try {
        const invite = await Invite.findOne({
          where: { link: req.body.link },
          include: { model: Quiz, attributes: ["id"] },
        });
        const quizId = invite.Quiz.id;
        await Assignment.findOrCreate({
          where: { StudentId: req.user.user.id, QuizId: quizId },
        });
        res.redirect("/student");
      } catch (err) {
        res.redirect("/student/login");
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

    const student = await Student.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: await bcrypt.hash(password, 10),
      phone: phone,
      cnic: cnic,
      InviteId: invite.id,
    });

    // assign the quiz associated with the invite to this student
    const new_assignment = await Assignment.create({
      StudentId: student.id,
      QuizId: invite.QuizId,
    });

    // send automated email to student
    try {
      await sendHTMLMail(email, `Welcome to IEC LCMS`, 
      { 
        heading: 'Welcome to the IEC LCMS',
        inner_text: "We have sent you an assessment to solve. You have 72 hours to solve the assessment.",
        button_announcer: "Click on the button below to solve the Assessment",
        button_text: "Solve Assessment",
        button_link: "https://apply.iec.org.pk/student/login"
      })
    } catch(err) {
      console.log("Email sending failed.")
    }
    res.redirect("/student/login");
  } catch (err) {
    console.log(err);
    if (err.errors) {
      res.redirect(
        "/invite/" +
          invite_link +
          "?error=" +
          encodeURIComponent(err.errors[0].type)
      );
    } else res.redirect("/invite/" + invite_link);
  }
});

app.get("/email-exists/:email", async (req, res) => {
  if ((await Student.count({ where: { email: req.params.email } })) > 0)
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

app.post("/save-quiz", checkAdminAuthenticated, async (req, res) => {
  if (req.body.quizId == null) {
    // if new quiz being created
    saveNewQuiz(req, res);
  } else {
    // if old quiz being updated
    const quiz = await Quiz.findOne({
      where: {
        id: req.body.quizId,
      },
    });
    if (quiz.allow_edit) saveExistingQuiz(req, res);
    else
      res.send({
        message:
          "Quiz could not be edited. At least 1 student has already attempted it or is attempting it. Please duplicate the quiz and make changes to the new quiz.",
        status: false,
        quizId: quiz.id,
      });
  }
});

app.get("/delete/quiz/:id", checkAdminAuthenticated, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    await deleteQuiz(req.params.id, t);
    t.commit();
    res.redirect("/admin");
  } catch (err) {
    t.rollback();
    res.redirect("/admin?error=delete");
    console.log("Error deleting quiz.");
  }
});

app.get("/student", checkStudentAuthenticated, async (req, res) => {
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

app.get("/student/login", checkStudentAlreadyLoggedIn, async (req, res) => {
  res.render("student/login/index.ejs", {
    link: req.query.link,
    email: req.query.email,
  });
});

app.get("/student/assignments", checkStudentAuthenticated, async (req, res) => {
  try {
    let assignments = await Assignment.findAll({
      where: {
        StudentId: req.user.user.id,
      },
      include: { model: Quiz, required: true, include: { model: Section } },
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
