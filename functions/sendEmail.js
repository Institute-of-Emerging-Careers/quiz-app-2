const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { Student } = require("../db/models/user");

async function sendTextMail(recepient, subject, text) {
  if (process.env.NODE_ENV == "production") {
    // checking if this student has unsubscribed from emails, if so, we won't send email
    const student = await Student.findOne({
      where: { email: recepient },
      attributes: ["hasUnsubscribedFromEmails"],
    });

    if (student == null || !student.hasUnsubscribedFromEmails) {
      var transporter = nodemailer.createTransport({
        service: "Outlook365",
        auth: {
          user: "mail@iec.org.pk",
          pass: "Jah29535",
        },
        tls: {
          ciphers: "SSLv3",
        },
        pool: true,
        maxConnections: 1,
        rateDelta: 60000,
        rateLimit: 30,
      });

      var mailOptions = {
        from: "IEC Assessments <mail@iec.org.pk>",
        to: recepient,
        subject: subject,
        text: text,
      };

      return transporter.sendMail(mailOptions);
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }
  } else {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

async function sendHTMLMail(recepient, subject, ejs_obj, force_send = false) {
  // if force send, then we send email regardless of student's email receiving preference (e.g. forgot password email)
  if (process.env.NODE_ENV == "production") {
    // checking if this student has unsubscribed from emails, and if so, we won't send him/her an email
    const student = await Student.findOne({
      where: { email: recepient },
      attributes: ["hasUnsubscribedFromEmails"],
    });
    if (student != null && (force_send || !student.hasUnsubscribedFromEmails)) {
      var transporter = nodemailer.createTransport({
        service: "Outlook365",
        auth: {
          user: "mail@iec.org.pk",
          pass: "Jah29535",
        },
        tls: {
          ciphers: "SSLv3",
        },
        pool: true,
        maxConnections: 1,
        rateDelta: 60000,
        rateLimit: 30,
      });

      const html = await ejs.renderFile(
        __dirname + "/../views/templates/mail-template-1.ejs",
        ejs_obj
      );

      var mailOptions = {
        from: "IEC Mail <mail@iec.org.pk>",
        to: recepient,
        subject: subject,
        html: html,
      };

      return transporter.sendMail(mailOptions);
    } else {
      console.log(recepient, "email not allowed.");
      return new Promise((resolve) => {
        resolve();
      });
    }
  } else {
    console.log("Dummy email sent to: ", recepient);
    return new Promise((resolve) => {
      resolve();
    });
  }
}

module.exports = { sendTextMail, sendHTMLMail };
