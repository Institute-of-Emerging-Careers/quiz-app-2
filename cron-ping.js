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
  console.log('Running reminder mailer every 3 hours');

    sendReminderEmails()
},{
    scheduled: false
});

assessment_reminder_mailer_task.start();