const ejs = require("ejs")
const sequelize = require("../db/connect")
var AWS = require("aws-sdk")
const { queueMail } = require("../bull")

const AWSSendEmail = (html, mailOptions) => {
	// Set the region
	AWS.config.update({
		accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
		region: process.env.AWS_SES_REGION,
	})

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
	}

	// Create the promise and SES service object
	var promise = new AWS.SES({ apiVersion: "2010-12-01" })
		.sendEmail(params)
		.promise()

	// Handle promise's fulfilled/rejected states
	return promise
}

async function sendHTMLMail(recepient, subject, ejs_obj, force_send = false) {
	// if force send, then we send email regardless of student's email receiving preference (e.g. forgot password email)
	if (process.env.NODE_ENV == "production" && recepient != undefined) {
		// checking if this student has unsubscribed from emails, and if so, we won't send him/her an email
		const student = await sequelize.models.Student.findOne({
			where: { email: recepient },
			attributes: ["hasUnsubscribedFromEmails"],
		})
		if (
			(student != null && (force_send || !student.hasUnsubscribedFromEmails)) ||
			student == null
		) {
			// sending email
			console.log("Sending email to ", recepient, "about '", subject, "'")
			const html = await ejs.renderFile(
				__dirname + "/../views/templates/mail-template-1.ejs",
				ejs_obj
			)

			var mailOptions = {
				from: "IEC Mail <mail@iec.org.pk>",
				to: recepient,
				subject: subject,
				html: html,
			}

			return AWSSendEmail(html, mailOptions)
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
			)
			return new Promise((resolve) => {
				resolve()
			})
		}
	} else {
		console.log(
			"Dummy email sent to: ",
			recepient,
			"Subject: ",
			subject,
			"Link: ",
			ejs_obj.button_link
		)
		return new Promise((resolve) => {
			resolve()
		})
	}
}

const sendApplicationReceiptEmail = async (user) => {
	// send application saved confirmation email
	const student = await user.getStudent({
		attributes: ["email", "firstName", "cnic"],
	})
	return queueMail(student.email, `IEC Application Receipt`, {
		heading: `Application Received`,
		inner_text: `Dear ${student.firstName}
    
We have received your application for the IEC Tech Apprenticeship Program by Institute of Emerging Careers (IEC). Your application is being processed. Please note the following steps during the acquisition process for which we will need your cooperation and patience. You will receive the email for an Online Assessment soon. Please stay tuned! 

Application Process:
<ul>
<li>Online Registration (17th Dec-31st Dec, 2022)</li>
<li>Online Assessment (2nd & 3rd Jan, 2023)</li>
<li>Online Orientation  (7th Jan, 2023)</li>
<li>One-on-One Interviews (10th Jan -21st Jan, 2023)</li>
<li>Zero Week (6th Feb-10th feb, 2023)</li>
<li>Probation Week </li>
<li>Course Begins</li>
</ul>

<em>(Note: Dear applicants these dates might change according to unexpected circumstances. However, the procedure will remain as stated above)</em>

    The process is long but we assure you that if you give your best, you can get through it and will be rewarded for all the effort you put in!

    Are you excited to start this journey with us? Stay tuned as our team gets back to you with an update within the next week or soon. For any further questions or concerns, feel free to contact us at <a href="mailto:namra.khan@iec.org.pk">namra.khan@iec.org.pk</a> or Whatsapp: 03338800947.
     
    Best Regards, 
    Director Admissions 
    Institute of Emerging Careers 
    http://www.iec.org.pk 
    <a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | Instagram | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a>`,
		button_announcer: null,
		button_text: null,
		button_link: null,
	})
}

module.exports = { sendHTMLMail, sendApplicationReceiptEmail }
