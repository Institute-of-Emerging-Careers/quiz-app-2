const express = require("express");
const router = express.Router();

const randomstring = require("randomstring");
const checkAdminAuthenticated = require("../../db/check-admin-authenticated");
const checkInterviewerAuthenticated = require("../../db/check-interviewer-authenticated");
const { generateRandomNumberInRange } = require("../../functions/utilities");
const getQuizTotalScore = require("../../functions/getQuizTotalScore");
const {
  InterviewRound,
  Interviewer,
  InterviewerInvite,
  InterviewerSlot,
  StudentInterviewRoundInvite,
  InterviewMatching,
  InterviewerCalendlyLinks
} = require("../../db/models/interview");
const { DateTime } = require("luxon");
const { queueMail } = require("../../bull");
const passport = require("passport");
const { Quiz, Section } = require("../../db/models/quizmodel");
const { Score, Assignment, Student, Attempt } = require("../../db/models/user");
const roundToTwoDecimalPlaces = require("../../functions/roundToTwoDecimalPlaces");
const { Op } = require("sequelize");
// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", checkAdminAuthenticated, (req, res) => {
  res.render("admin/interview/index.ejs", {
    env: process.env.NODE_ENV,
    myname: req.user.user.firstName,
    user_type: req.user.type,
    site_domain_name: process.env.SITE_DOMAIN_NAME,
    current_url: `/admin/interview${req.url}`,
  });
});

router.get("/new/:quiz_id", checkAdminAuthenticated, (req, res) => {
  const new_interview_round_name = `Interview Round ${DateTime.now().toFormat(
    "hh:mm:ss-yyyy-LLL-dd"
  )}`;
  InterviewRound.create({
    title: new_interview_round_name,
    QuizId: req.params.quiz_id,
  }).then((interview_round) => {
    res.render("admin/interview/new.ejs", {
      interview_round_name: new_interview_round_name,
      interview_round_id: interview_round.id,
      env: process.env.NODE_ENV,
      user_type: req.user.type,
    });
  });
});

router.get("/edit/:interview_round_id", checkAdminAuthenticated, (req, res) => {
  InterviewRound.findOne({
    where: { id: req.params.interview_round_id },
  })
    .then((interview_round) => {
      if (interview_round != null) {
        res.render("admin/interview/new.ejs", {
          interview_round_name: interview_round.title,
          interview_round_id: interview_round.id,
          env: process.env.NODE_ENV,
          user_type: req.user.type,
        });
      } else {
        res.render("templates/error.ejs", {
          additional_info: "No such interview round exists",
          error_message:
            "You must have entered the wrong URL into the address bar of your browser. Please recheck or contact IT.",
          action_link: "/interview",
          action_link_text: "Return to Interview Panel",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.patch(
  "/update-round-title/:interview_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const interview_round = await InterviewRound.findOne({
        where: { id: req.params.interview_round_id },
      });
      if (interview_round == null) res.sendStatus(401);
      else {
        await interview_round.update({ title: req.body.title });
        res.sendStatus(200);
      }
    } catch (err) {
      res.sendStatus(501);
    }
  }
);
router.post("/send-emails", checkAdminAuthenticated, async (req, res) => {
  const email_content = req.body.email_content;
  try {
    await new Promise((resolve) => {
      let i = 0;
      const n = req.body.users.length;
      if (i == n) resolve();
      req.body.users.forEach(async (interviewer) => {
        const interviewer_password = (
          await Interviewer.findOne({
            where: { email: interviewer.email },
            attributes: ["password"],
          })
        ).password;
        const interviewer_login_link = `${
          process.env.SITE_DOMAIN_NAME
        }/admin/interview/login?email=${
          interviewer.email
        }&password=${encodeURIComponent(interviewer_password)}`;
        await queueMail(interviewer.email, `${email_content.subject}`, {
          heading: email_content.heading,
          inner_text: email_content.body,
          button_announcer: email_content.button_pre_text,
          button_text: email_content.button_label,
          button_link: interviewer_login_link,
        });
        i++;
        if (i == n) resolve();
      });
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post(
  "/update-interviewer-list/:interview_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const interview_round = await InterviewRound.findOne({
        where: { id: req.params.interview_round_id },
      });

      await interview_round.update(
        { num_zoom_accounts: req.body.num_zoom_accounts },
        { where: { id: req.params.interview_round_id } }
      );

      const interviewers = await interview_round.getInterviewers();

      // we create two HashMaps. One for all the interviewers of this InterviewRound present in the Database, and one for all the interviewers sent by the user in this request

      let db_interviewers_map = new Map();
      interviewers.forEach((interviewer_object) => {
        db_interviewers_map.set(interviewer_object.email, interviewer_object);
      });

      let new_interviewers_map = new Map();
      req.body.interviewers.forEach((interviewer) => {
        new_interviewers_map.set(interviewer.email, true);
      });

      await new Promise((resolve) => {
        let i = 0;
        const n = req.body.interviewers.length;
        if (req.body.interviewers.length == 0) resolve();
        else {
          req.body.interviewers.forEach(async (interviewer) => {
            if (!db_interviewers_map.has(interviewer.email)) {
              console.log("oye hoy");
              const new_interviewer = (
                await Interviewer.findOrCreate({
                  where: { email: interviewer.email },
                  defaults: {
                    name: interviewer.name,
                    email: interviewer.email,
                    password: randomstring.generate({
                      length: generateRandomNumberInRange(14, 20),
                    }),
                  },
                })
              )[0];

              await InterviewerInvite.create({
                InterviewerId: new_interviewer.id,
                InterviewRoundId: req.params.interview_round_id,
              });
              db_interviewers_map.delete(interviewer.email);
            }
            i++;
            if (i == n) resolve();
          });
        }
      });

      await new Promise(async (resolve) => {
        let i = 0;
        const n = db_interviewers_map.size;
        if (n == 0) resolve();
        else {
          for (const interviewer of db_interviewers_map) {
            if (!new_interviewers_map.has(interviewer[1].email)) {
              await InterviewerInvite.destroy({
                where: {
                  InterviewerId: interviewer[1].id,
                  InterviewRoundId: req.params.interview_round_id,
                },
              });
            }
            i++;
            if (i == n) resolve();
          }
        }
      });

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(501);
    }
  }
);

router.get("/round/delete/:interview_round_id", async (req, res) => {
  try {
    await Promise.all([
      ...(
        await InterviewerInvite.findAll({
          where: { InterviewRoundId: req.params.interview_round_id },
        })
      ).map((invite) =>
        InterviewerSlot.destroy({ where: { InterviewerInviteId: invite.id } })
      ),
      InterviewerInvite.destroy({
        where: { InterviewRoundId: req.params.interview_round_id },
      }),
      InterviewRound.destroy({
        where: { id: req.params.interview_round_id },
      }),
    ]);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    re.sendStatus(500);
  }
});

router.get("/getTotalDuration/:interview_round_id", async (req, res) => {
  try {
    const interview_round = await InterviewRound.findOne({
      where: { id: req.params.interview_round_id },
    });
    const interviewers = await interview_round.getInterviewers();
  } catch(err){
  console.log(err);
  }
});

router.get("/login", async (req, res) => {
  let password = "",
    email = "";
  if (req.query.hasOwnProperty("password")) password = req.query.password;
  if (req.query.hasOwnProperty("email")) email = req.query.email;

  res.render("interviewer/login/index.ejs", {
    email: email,
    password: password,
  });
});

router.post(
  "/login",
  passport.authenticate("interviewer-login", {
    failureRedirect: "/",
    failureFlash: true,
  }),
  async (req, res) => {
    if (req.hasOwnProperty("user")) {
      res.redirect("/admin/interview/panel");
    } else {
      res.sendStatus(403);
    }
  }
);

router.get("/panel", checkInterviewerAuthenticated, async (req, res) => {
  try {
    const interviewer = await Interviewer.findOne({
      where: { id: req.user.user.id },
    });
    const interview_rounds = await interviewer.getInterviewRounds();

    res.render("interviewer/panel.ejs", {
      env: process.env.NODE_ENV, //required when deciding which React dependencies to include (prod or dev)
      myname: req.user.user.name,
      user_type: req.user.type,
      interview_rounds: interview_rounds,
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get(
  "/declare-time-slots/:interview_round_id",
  checkInterviewerAuthenticated,
  async (req, res) => {
    try {
      const interview_round = await InterviewRound.findOne({
        where: { id: req.params.interview_round_id },
      });
      res.render("interviewer/time-slots-picker.ejs", {
        env: process.env.NODE_ENV,
        myname: req.user.user.name,
        user_type: req.user.type,
        interview_round_id: req.params.interview_round_id,
        interview_round_title: interview_round.title,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get("/upload-link", checkInterviewerAuthenticated, async (req, res) => {
  try {
    const interview_rounds = await InterviewRound.findAll();

    const calendly_link = await InterviewerCalendlyLinks.findOne({
      where: { InterviewerId: req.user.user.id },
    }).calendly_link;


    res.render("interviewer/link-upload.ejs", {
      env: process.env.NODE_ENV,
      myname: req.user.user.name,
      user_type: req.user.type,
      current_link: calendly_link,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/upload-link", checkInterviewerAuthenticated, async (req, res) => {
	try {
		const interviewer = await Interviewer.findOne({
			where: { id: req.user.user.id },
		});

		if (interviewer == null) {
			res.sendStatus(404);
			return;
		}

    const drop_previous = await InterviewerCalendlyLinks.destroy({
      where: { InterviewerId: interviewer.id },
    });

		const response = await InterviewerCalendlyLinks.create({
			calendly_link: req.body.calendly_link,
			InterviewerId: interviewer.id,
		});

    res.sendStatus(200);

	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

router.post(
  "/interviewer/save-time-slots",
  checkInterviewerAuthenticated,
  async (req, res) => {
    const interviewer_invite = await InterviewerInvite.findOne({
      where: {
        InterviewerId: req.user.user.id,
        InterviewRoundId: req.body.interview_round_id,
      },
    });
    await interviewer_invite.deleteSlots(); //custom class instance method I declared in models/interview.js
    let promises = [];
    req.body.time_slots.forEach((time_slot) => {
      console.log(interviewer_invite.id);
      promises.push(
        InterviewerSlot.create({
          start: time_slot.start,
          end: time_slot.end,
          duration: time_slot.duration,
          InterviewerInviteId: interviewer_invite.id,
        })
      );
    });
    Promise.all(promises)
      .then((arr) => {
        console.log(arr);
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  }
);

router.post("/interviewees/save", checkAdminAuthenticated, async (req, res) => {
  try {
    const interview_round_id = req.body.interview_round_id;

    // let's get all students who have already been invited to this InterviewRound and create a hashmap.
    let interview_round_invites = await StudentInterviewRoundInvite.findAll({
      where: { InterviewRoundId: interview_round_id },
    });

    let students_already_invited = new Map();
    interview_round_invites.map((invite) => {
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
          await StudentInterviewRoundInvite.create({
            StudentId: student.id,
            InterviewRoundId: interview_round_id,
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
    console.log(err);
    res.json({ success: false });
  }
});

router.get(
  "/all-students/:interview_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    const interview_round = await InterviewRound.findOne({
      where: { id: req.params.interview_round_id },
      attributes: ["id", "QuizId"],
      include: [{ model: Quiz, include: [Section] }],
    });

    if (interview_round != null && interview_round.QuizId != null) {
      // finding total score of quiz
      let quiz_total_score = await getQuizTotalScore(interview_round.Quiz);

      let data = []; //list of students who have solved this quiz and their data

      let assignments = await Assignment.findAll({
        where: { QuizId: interview_round.QuizId, completed: true },
        include: [
          {
            model: Student,
            include: [InterviewRound],
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
              added:
                assignment.Student.hasOwnProperty("InterviewRounds") &&
                assignment.Student.InterviewRounds.length > 0 &&
                assignment.Student.InterviewRounds.reduce(
                  (hasThisInterviewRoundId, cur) =>
                    hasThisInterviewRoundId
                      ? true
                      : cur.id == req.params.interview_round_id
                      ? true
                      : false,
                  false
                ),
              id: assignment.Student.id,
              name:
                assignment.Student.firstName +
                " " +
                assignment.Student.lastName,
              email: assignment.Student.email,
              age: assignment.Student.age,
              gender: assignment.Student.gender,
              total_score_achieved: 0,
              assignment_completed_date: assignment.updatedAt,
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
      // console.log("Error: QuizId: or orientation:", orientation, "is NULL");
      res.json({ success: false });
    }
  }
);

router.get(
  "/interviewer/time-slots/:interview_round_id",
  checkInterviewerAuthenticated,
  async (req, res) => {
    try {
      const interview_round = await InterviewRound.findOne({
        where: { id: req.params.interview_round_id },
        attributes: ["num_zoom_accounts"],
      });

      const interviewer_invite = await InterviewerInvite.findOne({
        where: {
          InterviewerId: req.user.user.id,
          InterviewRoundId: req.params.interview_round_id,
        },
      });
      const interviewer_time_slots =
        await interviewer_invite.getInterviewerSlots();
      const all_other_invites = await InterviewerInvite.findAll({
        where: {
          InterviewRoundId: req.params.interview_round_id,
          InterviewerId: { [Op.not]: req.user.user.id },
        },
      });
      let all_other_time_slots = await Promise.all(
        all_other_invites.map((invite) =>
          invite.getInterviewerSlots({
            attributes: ["start", "end", "duration"],
          })
        )
      );

      all_other_time_slots = all_other_time_slots.reduce(
        (final_arr, cur_arr) => [...final_arr, ...cur_arr],
        []
      );

      res.json({
        success: true,
        time_slots: interviewer_time_slots,
        all_other_time_slots: all_other_time_slots,
        num_zoom_accounts: interview_round.num_zoom_accounts,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/interviewers/all/:interview_round_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      const interview_round = await InterviewRound.findOne({
        where: { id: req.params.interview_round_id },
      });

      if (interview_round == null) res.sendStatus(404);
      else {
        let interviewers = await interview_round.getInterviewers({
          attributes: ["id", "name", "email"],
        });
        const interviewer_invites = await Promise.all(
          interviewers.map((interviewer) =>
            InterviewerInvite.findOne({
              where: {
                InterviewRoundId: req.params.interview_round_id,
                InterviewerId: interviewer.id,
              },
            })
          )
        );

        const interviewer_slots = await Promise.all(
          interviewer_invites.map((interviewer_invite) =>
            InterviewerSlot.findAll({
              where: { InterviewerInviteId: interviewer_invite.id },
            })
          )
        );

        let data = interviewers.map((interviewer, i) => {
          return {
            name: interviewer.name,
            email: interviewer.email,
            time_slots: interviewer_slots[i],
            time_declared: interviewer_slots[i].length > 0,
          };
        });

        res.status(200).json({
          interviewers: data,
          num_zoom_accounts: interview_round.num_zoom_accounts,
        });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.delete(
  "/interviewer/time-slot/delete/:time_slot_id",
  checkAdminAuthenticated,
  async (req, res) => {
    try {
      await InterviewerSlot.destroy({ where: { id: req.params.time_slot_id } });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get("/all", checkAdminAuthenticated, (req, res) => {
  InterviewRound.findAll({ order: [["id", "desc"]] })
    .then((interview_rounds) => {
      res.json({ success: true, interview_rounds: interview_rounds });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

/**
 * @params {interviewer id, interviewee id}
 * @returns {success}
 */


router.post("/:interview_round_id/create-matching", checkAdminAuthenticated, async (req, res) => {
  try {
    const interview_round = await InterviewRound.findOne({ where: { id: req.params.interview_round_id }});

    if (interview_round == null) res.sendStatus(300);

    //drop all matchings with the same interview round 
    await InterviewMatching.destroy({ where: { InterviewRoundId: req.params.interview_round_id }});

    //extract unique interviewer emails from req.body
    const interviewer_emails = [...new Set(req.body.matching.map((slot) => slot.interviewer_email))];

    // get corresponding interviewer ids
    const interviewers = await Interviewer.findAll({ where: { email: interviewer_emails } });

    //replace interviewer emails with interviewer ids
    req.body.matching.forEach((slot) => {
      slot.interviewer_id = interviewers.find((interviewer) => interviewer.email === slot.interviewer_email).id;
      slot.InterviewerId = slot.interviewer_id;
      slot.StudentId = slot.student_id ;
      slot.InterviewRoundId = req.params.interview_round_id;

      delete slot.interviewer_id;
      delete slot.student_id;

    });

    await InterviewMatching.bulkCreate(
      req.body.matching,
    )
  
    res.sendStatus(200);


  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/:interview_round_id/:interviewer_id/matchings", checkAdminAuthenticated, async (req, res) => {
  try {
    const interview_round = await InterviewRound.findOne({ where: { id: req.params.interview_round_id }});

    if (interview_round == null) res.sendStatus(404);

    const interview_matchings = await InterviewMatching.findAll({ where: { InterviewRoundId: req.params.interview_round_id, InterviewerId: req.params.interviewer_id }});

    const students = await Promise.all(interview_matchings.map((matching) => matching.getStudent()));

    console.log(students);

    res.sendStatus(200);

    res.json({ success: true, interview_matchings: interview_matchings });

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/:interview_round_id/matchings", checkAdminAuthenticated, async (req, res) => {
  try {
    const interview_round = await InterviewRound.findOne({ where: { id: req.params.interview_round_id }});
    if (interview_round == null) res.sendStatus(404);

    const interview_matchings = await InterviewMatching.findAll({ where: { InterviewRoundId: req.params.interview_round_id }});

    //format matchings as per frontend requirements
    const matchings = interview_matchings.map((matching) => {
      return {
        student_id: matching.StudentId,
        interviewer_id: matching.InterviewerId,
        student_email : matching.student_email,
        interviewer_email: matching.interviewer_email,
      }
    });

    res.status(200);
    res.json({ success: true, interview_matchings: matchings });

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/:interview_round_id/:interviewer_id/send-matching-emails", checkAdminAuthenticated, async (req, res) => {
  try {
    console.log(req.params)
    const interview_round = await InterviewRound.findOne({ where: { id: req.params.interview_round_id }});
    if (interview_round == null) res.sendStatus(404);

    const interview_matchings = await InterviewMatching.findAll({ where: { InterviewRoundId: req.params.interview_round_id, InterviewerId: req.params.interviewer_id }});

    const interviewer = await Interviewer.findOne({ where: { id: req.params.interviewer_id }});
    const interviewer_link = await InterviewerCalendlyLinks.findOne({ where: { InterviewerId: req.params.interviewer_id }});

    console.log(interviewer_link);
    if (interviewer_link == null) {
      res.status(404);
      res.json({ success: false, message: "Interviewer calendly link not found" });
      return
    };


    for (const matching of interview_matchings) {
      await queueMail(matching.student_email, `IEC interview invite`, {
        heading: "Interview Invitation",
        inner_text: `Dear Student,<br>We hope you are well.<br>Congratulations on passing the assessment phase. You have been assigned to ${interviewer.name} for your interview.<br>`,
        button_announcer: `Click the following button to go to Calendly and book a slot with your assigned interviewer. <br>Please note that you need to book a slot for the interview within 48 hours.<br>`,
        button_text: "Book a slot",
        button_link: interviewer_link.calendly_link,
      });
      
    }
      

    res.sendStatus(200)

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;