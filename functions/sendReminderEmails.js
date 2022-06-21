const { DateTime } = require("luxon");
const { Quiz } = require("../db/models/quizmodel");
const {
  Student,
  Invite,
  Assignment,
  Answer,
  Attempt,
  PasswordResetLink,
} = require("../db/models/user");
const allSectionsSolved = require("./allSectionsSolved");
const { queueMail } = require("../bull");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

async function sendReminderEmails() {
  try {
    console.log("send Reminder Emails");
    const quizzes = await Quiz.findAll({
      where: {
        sendReminderEmails: true,
      },
      include: [
        {
          model: Assignment,
          where: {
            [Op.and]: [
              sequelize.literal(
                "TIME_TO_SEC(TIMEDIFF(NOW(),Assignments.timeOfLastReminderEmail)) > (12*60*60)"
              ),
              { completed: false },
            ],
          },
          include: [
            {
              model: Student,
              attributes: ["email"],
            },
          ],
          //i.e. if it has been more than 12 hours since last reminder email and assignment has not been completed yet
        },
      ],
    });

    if (quizzes != null && quizzes.length != 0) {
      let promises = quizzes.map((quiz) => {
        if (quiz.Assignments != null && quiz.Assignments.length != 0) {
          console.log(quiz.Assignments);
          return quiz.Assignments.map((assignment) => {
            //432 00 000 = 12 hours

            // now check if student still has an unsolved section

            const all_sections_solved = assignment.completed;
            if (!all_sections_solved) {
              const deadline = DateTime.fromMillis(
                new Date(assignment.createdAt).getTime()
              ).plus({ days: 3 }); //timeOfAssignment + 72 hours

              const deadline_diff = deadline
                .diff(DateTime.now(), ["days", "hours", "minutes"])
                .toObject();
              const remaining_days = deadline_diff.days;
              const remaining_hours = deadline_diff.hours;
              let remaining_time_in_words = `${remaining_days} day`;
              if (remaining_days != 1) remaining_time_in_words += "s";
              remaining_time_in_words += ` ${remaining_hours} hour`;
              if (remaining_hours != 1) remaining_time_in_words += "s";

              if (remaining_days > 0 && remaining_days < 3) {
                //if remaining time more than 0 days and less than 3 days then send email, because we don't want to be sending reminder emails to students whose 72 hours have already passed

                console.log(
                  `Sending email. Time left: ${remaining_days} days and ${remaining_hours} hours`
                );

                // send reminder mail
                return [
                  queueMail(
                    assignment.Student.email,
                    `Reminder | IEC Assessment Deadline`,
                    {
                      heading: "IEC Assessment Due",
                      inner_text: `Dear Student<br>You only have ${remaining_time_in_words} to solve the IEC Assessment.<br>If you have already completed the assessment, you can ignore this email.`,
                      button_announcer:
                        "Click on the button below to solve the Assessment",
                      button_text: "Solve Assessment",
                      button_link: "https://apply.iec.org.pk/student/login",
                    }
                  ),

                  // now updating timeOfLastReminderEmail in assignment
                  assignment.update({
                    timeOfLastReminderEmail: Date.now(),
                  }),
                ];
              }
            }
          });
        } else return [];
      });
      promises = promises.reduce((final, cur) => {
        return [...final, ...cur];
      }, []);
      return Promise.all(promises);
    } else {
      console.log("No reminder emails to send.");
    }
  } catch (err) {
    console.log(err);
  }
}

// sendReminderEmails()
//   .then(() => {
//     console.log("done");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = sendReminderEmails;
