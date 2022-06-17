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
async function sendReminderEmails() {
  const quizzes = await Quiz.findAll({
    where: {
      sendReminderEmails: true,
    },
    include: [
      {
        model: Assignment,
        include: [
          {
            model: Student,
            attributes: ["email"],
          },
        ],
        where: sequelize.literal(
          "TIME_TO_SEC(TIMEDIFF(NOW(),Assignments.timeOfLastReminderEmail)) > (12*60*60)"
          //i.e. if it has been more than 12 hours since last reminder email
        ),
      },
    ],
  });

  if (quizzes != null && quizzes.length != 0) {
    quizzes.forEach((quiz) => {
      if (quiz.Assignments != null && quiz.Assignments.length != 0) {
        quiz.Assignments.forEach(async (assignment) => {
          //432 00 000 = 12 hours

          // now check if student still has an unsolved section

          const all_sections_solved = assignment.completed
            ? true
            : await allSectionsSolved(quiz.id, assignment);
          if (!all_sections_solved) {
            // console.log(assignment.createdAt)
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

              // send reminder mail
              await queueMail(
                assignment.Student.email,
                `Reminder | IEC Assessment Deadline`,
                {
                  heading: "IEC Assessment Due",
                  inner_text: `Dear Student<br>You only have ${remaining_time_in_words} to solve the IEC Assessment.`,
                  button_announcer:
                    "Click on the button below to solve the Assessment",
                  button_text: "Solve Assessment",
                  button_link: "https://apply.iec.org.pk/student/login",
                }
              );
              console.log(
                `Sending email. Time left: ${remaining_days} days and ${remaining_hours} hours`
              );

              // now updating timeOfLastReminderEmail in assignment
              await assignment.update({
                timeOfLastReminderEmail: Date.now(),
              });
            }
          }
        });
      }
    });
  } else {
    console.log("No reminder emails to send.");
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
