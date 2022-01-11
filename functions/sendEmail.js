var nodemailer = require('nodemailer');

function sendTextMail(recepient, subject, text) {
    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: 'mail@iec.org.pk',
          pass: 'Jah29535'
        }
      });
      
      var mailOptions = {
        from: 'mail@iec.org.pk',
        to: recepient,
        subject: subject,
        text: text
      };
      
      return transporter.sendMail(mailOptions);
}

function sendHTMLMail(recepient, subject, html) {
    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: 'mail@iec.org.pk',
          pass: 'Jah29535'
        }
      });
      
      var mailOptions = {
        from: 'mail@iec.org.pk',
        to: recepient,
        subject: subject,
        html: html
      };
      
      return transporter.sendMail(mailOptions);
}

module.exports = {sendTextMail, sendHTMLMail}