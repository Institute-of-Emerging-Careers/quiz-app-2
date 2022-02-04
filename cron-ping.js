const cron = require('node-cron');
  const {
    Student,
    Invite,
    Assignment,
    Answer,
    Attempt,
    PasswordResetLink
  } = require("./db/models/user");
const scoreAssignmentsWhoseDeadlineHasPassed = require('./functions/scoreAssignmentsWhoseDeadlineHasPassed');
const scoreAttemptsWhoseTimerHasEnded = require('./functions/scoreAttemptsWhoseTimerHasEnded');
const sendReminderEmails = require('./functions/sendReminderEmails');

const assessment_reminder_mailer_task = cron.schedule('0 0 */3 * * *', () => {
  console.log('Running 3-hourly reminder email.');
  sendReminderEmails()
},{
    scheduled: false
});

const score_past_deadline_attempts = cron.schedule('0 */3 * * * *', async () => {
  console.log("Running 3-minutely script to score past-deadline assignments")
  await scoreAttemptsWhoseTimerHasEnded()
  await scoreAssignmentsWhoseDeadlineHasPassed()
},{
  scheduled: false
})

assessment_reminder_mailer_task.start();
score_past_deadline_attempts.start()