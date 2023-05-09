const ejs = require("ejs")
const sequelize = require("../db/connect")
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses")
const { queueMail } = require("../bull")

const client = new SESClient({
	region: process.env.AWS_REGION,
})

const AWSSendEmail = (html, mailOptions) => {
	const command = new SendEmailCommand({
		Destination: {
			/* required */
			CcAddresses: [
				/* more items */
			],
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
		Source: mailOptions.from,
		ReplyToAddresses: [mailOptions.from],
	})

	// Return promise
	return client.send(command)
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
	console.log("user.id", user.id)
	console.log("user", user)

	return queueMail(student.email, `IEC Application Receipt`, {
		heading: `Application Received`,
		inner_text: `Dear ${student.firstName}
    
        Thank you for applying to the “Tech Apprenticeship Program Cohort 08” at the Institute of Emerging Careers. Your Application number is ${user.id}. You may use this number for future correspondence. 

        Our next part of the registration process includes Assessments which have been assigned to you on the portal you signed-up on. This is compulsory to complete within 72 hours of receiving this email. The assessment is designed to test your basic English language and Critical Thinking skills. Incompletion of the Assessment will lead to disqualification. 

		Please log into your student portal by clicking <a href="https://apply.iec.org.pk/student">here</a> to solve the assessment.

		Also, check your inbox and spam folder regularly so you do not miss any updates. 

        Important Dates and Next Steps:
        <b>Stage 1:</b>
            Assessments (to be completed within 72 hours
        <b>Stage 2:</b>
            Registration Fee Payment & Signing LEC Agreement 
        <b>Stage 3:</b>
            Interviews 
        <b>Final Stage:</b>
            Zero Week 

        Are you excited to start this journey with us?

        Stay tuned on your email account as you will receive successive emails in the coming days. For any further questions or concerns, feel free to contact us at info@iec.org.pk or Whatsapp: 03338800947

		Best Regards, 
		Team Acquisition
		Institute of Emerging Careers 
		http://www.iec.org.pk 
		<a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | <a href = "https://www.instagram.com/emergingcareer/">Instagram</a> | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a>`,
		button_announcer: null,
		button_text: null,
		button_link: null,
	})
}

const sendQuizRejectionEmail = async (email) => {
	return queueMail(email, `IEC Assessment Result`, {
		heading: `Quiz Result`,
		inner_text: `Dear student, 
    
		Thank you for showing your interest in the “Tech Apprenticeship Program Cohort 8” at the Institute of Emerging Careers. We appreciate you taking out time to apply for the program.
		
		We regret to inform you that we will not be moving forward with your application because you scored below 50% in the assessment.

		We are thankful to you for applying. All of us at IEC are hopeful to see you in the next cycle of the program and help you build your digital career.

		Stay tuned to our website and social media for the upcoming programs. 
		We wish you all the best in your future career endeavors.


		Best Regards, 
		Team Acquisition
		Institute of Emerging Careers 
		http://www.iec.org.pk 
		<a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | <a href = "https://www.instagram.com/emergingcareer/">Instagram</a> | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a>`,
		button_announcer: null,
		button_text: null,
		button_link: null,
	})
}

const sendQuizAcceptanceEmail = async (email) => {
	return queueMail(email, `IEC Assessment Result`, {
		heading: `Registration Fee Payment`,
		inner_text: `Dear student, 
    
		Congratulations on successfully completing the assessment and qualifying for the last round of the selection process. 
		
		You are a couple of steps away from becoming part of a transforming digital skills learning journey with the Institute of Emerging Careers. Please take note of the following steps:

		<ul>
			<li>In the near future, you will have to sign The LEC Agreement which will be assigned to you in the <a href="https://apply.iec.org.pk/student">student portal</a>. When it is available, you will receive an email from us asking you to sign the LEC document. Then, you will be able to download the document from the portal, sign it, and upload it back again to the student portal.</li>

			<li>Right now, you must pay a Registration Fee of Rs. 500 which is non-refundable. After paying, please upload the payment receipt to the form link below. Payment details are also mentioned in the same link: <a href="https://forms.gle/eE3wZTEGV88Zo65F7">https://forms.gle/eE3wZTEGV88Zo65F7</a>
			</li>

		</ul>

		The last round of the selection process is an Individual Interview where our team will be meeting you online to know you better. You will be contacted shortly, do keep an eye on your email inbox.

		For any further questions or concerns, feel free to contact us at info@iec.org.pk or Whatsapp: 03338800947

		Best Regards, 
		Team Acquisition
		Institute of Emerging Careers 
		http://www.iec.org.pk 
		<a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | <a href = "https://www.instagram.com/emergingcareer/">Instagram</a> | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a>`,
		button_announcer: null,
		button_text: null,
		button_link: null,
	})
}


module.exports = { sendHTMLMail, sendApplicationReceiptEmail, sendQuizRejectionEmail, sendQuizAcceptanceEmail }
