const Queue = require("bull");

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

module.exports = { email_bull_queue, queueMail };
