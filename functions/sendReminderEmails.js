const { DateTime } = require("luxon");
const { Quiz } = require("../db/models/quizmodel");
const {
    Student,
    Invite,
    Assignment,
    Answer,
    Attempt,
    PasswordResetLink
  } = require("../db/models/user");
const allSectionsSolved = require("./allSectionsSolved");
const {sendTextMail, sendHTMLMail} = require("./sendEmail")
const {msToTime} = require("./millisecondsToMinutesAndSeconds");
const roundToTwoDecimalPlaces = require("./roundToTwoDecimalPlaces");

async function sendReminderEmails() {
  const quizzes = await Quiz.findAll({where:{
    sendReminderEmails:true
  },
  include:[{
    model: Assignment,
    include: [{
      model: Student,
      attributes: ["email"]
    }]
  }]})

  if (quizzes != null && quizzes.length!=0) {
    quizzes.forEach(quiz=>{

      if (quiz.Assignments != null && quiz.Assignments.length!=0) {
  
        quiz.Assignments.forEach(async (assignment)=>{
    
          // check if it has been more than 12 hours since last email sent to this person about this assignment
          if (DateTime.now() - assignment.timeOfLastReminderEmail >= 43200000) { //432 00 000 = 12 hours
      
            // now check if student still has an unsolved section
            const all_sections_solved = await allSectionsSolved(quiz.id, assignment)
            if (!all_sections_solved) {
              // console.log(assignment.createdAt)
              const deadline = DateTime.fromMillis(new Date(assignment.createdAt).getTime()).plus({days:3}); //timeOfAssignment + 72 hours

              const remaining_days = deadline.diff(DateTime.now(), "days").toObject().days

              if (remaining_days>0 && remaining_days < 3) { //if remaining time more than 0 days and less than 3 days then send email, because we don't want to be sending reminder emails to students whose 72 hours have already passed
                console.log(7)
                // send reminder mail
                await sendHTMLMail(assignment.Student.email, `Reminder | IEC Assessment Deadline`, { 
                  heading: 'IEC Assessment Due',
                  inner_text: `Dear Student<br>You only have ${roundToTwoDecimalPlaces(remaining_days)} days to solve the IEC Assessment.`,
                  button_announcer: "Click on the button below to solve the Assessment",
                  button_text: "Solve Assessment",
                  button_link: "https://apply.iec.org.pk/student/login"
                }) 
                console.log("Sending email. Time left: ", roundToTwoDecimalPlaces(remaining_days))

                // now updating timeOfLastReminderEmail in assignment
                await assignment.update({
                  timeOfLastReminderEmail: Date.now()
                })
              }
            }
          }
        })
      }
    })
  } else {
    console.log("No reminder emails to send.")
  }
}

module.exports = sendReminderEmails