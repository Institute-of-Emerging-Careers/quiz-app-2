const nodemailer = require('nodemailer');
const ejs = require("ejs")

function sendTextMail(recepient, subject, text) {
    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: 'mail@iec.org.pk',
          pass: 'Jah29535'
        }
      });
      
      var mailOptions = {
        from: 'IEC Assessments <mail@iec.org.pk>',
        to: recepient,
        subject: subject,
        text: text
      };
      
      return transporter.sendMail(mailOptions);
}

async function sendHTMLMail(recepient, subject, ejs_obj) {
    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: 'mail@iec.org.pk',
          pass: 'Jah29535'
        }
      });

    const html = await ejs.renderFile(__dirname + "/../views/templates/mail-template-1.ejs", ejs_obj)
      
    var mailOptions = {
      from: 'IEC Assessments <mail@iec.org.pk>',
      to: recepient,
      subject: subject,
      html: html
    };
    
    return transporter.sendMail(mailOptions);
}

module.exports = {sendTextMail, sendHTMLMail}