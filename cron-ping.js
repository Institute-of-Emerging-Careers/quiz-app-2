const cron = require('node-cron');
  const {
    Student,
    Invite,
    Assignment,
    Answer,
    Attempt,
    PasswordResetLink
  } = require("./db/models/user");
const sendReminderEmails = require('./functions/sendReminderEmails');

const assessment_reminder_mailer_task = cron.schedule('0 0 */3 * * *', () => {
  console.log('Running 3-hourly reminder email.');
    sendReminderEmails()
},{
    scheduled: false
});

assessment_reminder_mailer_task.start();