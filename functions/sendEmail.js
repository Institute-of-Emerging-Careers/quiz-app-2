const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { Student } = require("../db/models/user");
var AWS = require("aws-sdk");

const AWSSendEmail = (html, mailOptions) => {
  // Set the region
  AWS.config.update({
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
  });

  // Create sendEmail params
  var params = {
    Destination: {
      /* required */
      CcAddresses: [],
      ToAddresses: [mailOptions.to],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: mailOptions.subject,
      },
    },
    Source: mailOptions.from /* required */,
    ReplyToAddresses: [
      mailOptions.from,
      /* more items */
    ],
  };

  // Create the promise and SES service object
  var promise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  return promise;
};

async function sendHTMLMail(recepient, subject, ejs_obj, force_send = false) {
  // if force send, then we send email regardless of student's email receiving preference (e.g. forgot password email)
  if (process.env.NODE_ENV == "production") {
    // checking if this student has unsubscribed from emails, and if so, we won't send him/her an email
    const student = await Student.findOne({
      where: { email: recepient },
      attributes: ["hasUnsubscribedFromEmails"],
    });
    if (
      (student != null && (force_send || !student.hasUnsubscribedFromEmails)) ||
      student == null
    ) {
      // sending email
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

      return AWSSendEmail(html, mailOptions);
      /*promise.then(function (data) {
        console.log(data.MessageId);
        res.sendStatus(200);
      })
      .catch(function (err) {
        console.error(err, err.stack);
        res.sendStatus(500);
      });*/
    } else {
      console.log(
        recepient,
        "email does not exist in database or has unsubscribed."
      );
      return new Promise((resolve) => {
        resolve();
      });
    }
  } else {
    console.log(
      "Dummy email sent to: ",
      recepient,
      "Link: ",
      ejs_obj.button_link
    );
    return new Promise((resolve) => {
      resolve();
    });
  }
}

module.exports = { sendHTMLMail };
