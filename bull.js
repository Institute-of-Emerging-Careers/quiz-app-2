const Queue = require("bull");
const { sendHTMLMail } = require("./functions/sendEmail");

// Bull
const email_bull_queue = new Queue("Email Sending", {
  limiter: {
    max: 14,
    duration: 1000,
  },
});

function queueMail(recepient, subject, ejs_obj, force_send = false) {
  return new Promise((resolve) => {
    email_bull_queue.add({
      recepient: recepient,
      subject: subject,
      ejs_obj: ejs_obj,
      force_send: force_send,
    });
    resolve();
  });
}

email_bull_queue.process(function (job, done) {
  // send force=true with password recet email
  sendHTMLMail(
    job.data.recepient,
    job.data.subject,
    job.data.ejs_obj,
    job.data.force_send
  )
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

module.exports = { email_bull_queue, queueMail };
