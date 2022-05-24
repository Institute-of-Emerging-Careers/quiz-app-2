const express = require("express");
const router = express.Router();

// My requirements
const checkAdminAuthenticated = require("../db/check-admin-authenticated");
const checkStudentAuthenticated = require("../db/check-student-authenticated");
const { Email } = require("../db/models/user");
const { sendHTMLMail } = require("../functions/sendEmail");

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/compose", checkAdminAuthenticated, async (req, res) => {
  const emails = await Email.findAll({ limit: 10, order: [["id", "desc"]] });
  res.render("admin/email/compose.ejs", {
    user_type: req.user.type,
    emails: emails,
  });
});

router.post("/preview", checkAdminAuthenticated, (req, res) => {
  res.render("templates/mail-template-1.ejs", {
    heading: req.body.heading,
    inner_text: req.body.body,
    button_announcer: req.body.button_announcer,
    button_text: req.body.button_text,
    button_link: req.body.button_url,
  });
});

router.post("/send/batch", checkAdminAuthenticated, async (req, res) => {
  try {
    // saving this email to Email history model
    await Email.create({
      subject: req.body.email_content.subject,
      heading: req.body.email_content.heading,
      body: req.body.email_content.inner_text,
      button_pre_text: req.body.email_content.button_announcer,
      button_label: req.body.email_content.button_text,
      button_url: req.body.email_content.button_link,
    });
    await new Promise((resolve) => {
      let num_emails = 0;
      let target_num_emails = req.body.email_addresses.length;
      req.body.email_addresses.forEach(async (email) => {
        try {
          await sendHTMLMail(email, req.body.email_content.subject, {
            heading: req.body.email_content.heading,
            inner_text: req.body.email_content.inner_text,
            button_announcer: req.body.email_content.button_announcer,
            button_text: req.body.email_content.button_text,
            button_link: req.body.email_content.button_link,
          });
          num_emails++;
          if (num_emails == target_num_emails) resolve();
        } catch (err) {
          console.log("Email sending failed.", err);
          num_emails++;
          if (num_emails == target_num_emails) resolve();
        }
      });
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/unsubscribe", checkStudentAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.user.user.id } });
    if (student != null) {
      student.hasUnsubscribedFromEmails = true;
      await student.save();
      res.render("templates/error.ejs", {
        additional_info: "Successfully Unsubscribed",
        error_message:
          "You will not receive any more similar automated emails from the IEC LCMS.",
        action_link: "/",
        action_link_text: "Click here to go to the IEC LCMS home page.",
      });
    }
  } catch (err) {
    res.render("templates/error.ejs", {
      additional_info: "Failed",
      error_message:
        "We could not remove you from the mailing list. We are terribly sorry. Please email the tech team at mail@iec.org.pk for assistance.",
      action_link: "/",
      action_link_text: "Click here to go to the IEC LCMS home page.",
    });
  }
});

module.exports = router;
