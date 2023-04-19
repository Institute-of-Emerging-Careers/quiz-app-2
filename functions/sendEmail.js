const ejs = require("ejs")
const sequelize = require("../db/connect")
const {
	SES
} = require("@aws-sdk/client-ses");
const { queueMail } = require("../bull")

const AWSSendEmail = (html, mailOptions) => {
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
	var promise = new SES({ apiVersion: "2010-12-01", region: process.env.AWS_REGION })
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
    
		Thank you for applying to the “Tech Apprenticeship Program Cohort 07” at the Institute of Emerging Careers. 

		Congratulations you have successfully completed your registration. Our next part of the registration process includes Assessments. This is compulsory to complete within 48 hours of receiving this email. The assessment is designed to test your basic English language and Critical Thinking skills. Incompletion of the Assessment will lead to disqualification. 

		Please log into your student portal at <a href="https://apply.iec.org.pk/student">https://apply.iec.org.pk/student</a> to solve the assessment.

		Also, check your inbox and spam folder regularly so you do not miss any updates. 

		Courses Offered for Cohort 07:  
		1. Devops/cloud computing
		2. Node/Next JS
		3. Mobile application development
		4. Web frontend with react

		
		Important Dates and Next Steps:

		<ul>
		<li>Assessments (to be completed within 48 hours)</li>
		<li>Interviews (21st - 30th March)</li>
		<li>e-LEC Agreement Submission (deadline till 30th March)</li>
		<li>Zero Week (3rd April-7th April)</li>
		</ul>

		Are you excited to start this journey with us?

		Stay tuned on your email account as you will be receiving successive emails in the coming days. For any further questions or concerns, feel free to contact us at info@iec.org.pk or Whatsapp: 03338800947

     
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
