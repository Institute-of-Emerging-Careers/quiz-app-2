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

	return queueMail(
		student.email,
		`<i> IEC: Successful Registration for Tech Apprenticeship Program Cohort 09 </i>`,
		{
			heading: `Application Received`,
			inner_text: `Dear ${student.firstName}
	   <br />
       <i> Thank you for applying to the “Tech Apprenticeship Program Cohort 9” at the Institute of Emerging Careers.<b> Your Application number is ${user.id}</b>. You may use this number for future correspondence. 
	   <br />
        Our next part of the registration process includes <b>Assessments</b> which have been assigned to you on the portal you signed up on. This is compulsory to complete within <b> 5 days </b> of receiving this email. The assessment is designed to test your basic English language and Critical Thinking skills. <b> Incompletion of the Assessment will lead to disqualification. </b>
		<br />
        <b> Important Dates and Next Steps:</b>
		<b>Stage 1:</b>
		<ul style="padding-left: 50px;">
		  <li> Assessment  </li>
		</ul>
    	<b>Stage 2:</b>
		<ul style="padding-left: 50px;">
		  <li> Informative Sessions with the Team  </li>
		</ul>
   		<b>Stage 3:</b>
		<ul style="padding-left: 50px;">
		  <li> Registration Fee Payment & Signing LEC Agreement   </li>
		</ul>
        <b>Final Stage:</b>
		<ul style="padding-left: 50px;">
		  <li> Onboarding and Probation Weeks  </li>
		</ul>
		<br />
        For any further questions or concerns, feel free to contact us at <a href="ask@iec.org.pk">ask@iec.org.pk</a> ask@iec.org.pk or Whatsapp:03338800947
		<br />
		Best Regards, 
		Team Acquisition
		Institute of Emerging Careers 
		<a href="http://www.iec.org.pk" > http://www.iec.org.pk </a>  
		<a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | <a href = "https://www.instagram.com/emergingcareer/">Instagram</a> | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a> </i> `,
			button_announcer: null,
			button_text: null,
			button_link: null,
		}
	)
}

const sendQuizRejectionEmail = async (email) => {
	return queueMail(
		email,
		`IEC Assessment Result`,
		{
			heading: `Quiz Result`,
			inner_text: `Dear student, 
		<br />
		<i> Thank you for showing your interest in the “Tech Apprenticeship Program Cohort 9” at the Institute of Emerging Careers. We appreciate you taking out time to apply for the program.
		<br />
		We regret to inform you that we will not be moving forward with your application because <span> { You scored below 50% in the assessment} or {You didn't complete the assessment within 5 days deadline, despite the follow-ups}. </span>
		<br />
		All of us at IEC are hopeful to see you in the next cycle of the program and help you build your digital career.
		<br />
		Stay tuned to our website and social media for the upcoming programs. 
		<br />
		Best Regards, 
		Team Acquisition
		Institute of Emerging Careers 
		<a href="http://www.iec.org.pk" > http://www.iec.org.pk </a> 
		<a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | <a href = "https://www.instagram.com/emergingcareer/">Instagram</a> | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a> </i>`,
			button_announcer: null,
			button_text: null,
			button_link: null,
		},
		false,
		1 * 60 * 60
	) // 1h delay
}

const sendQuizAcceptanceEmail = async (email) => {
	return queueMail(email, `IEC Assessment Result`, {
		heading: `Registration Fee Payment`,
		inner_text: `Dear student, 
		<br />
		<i> Congratulations on completing the assessment and qualifying for the last round of the selection process.You are one compulsory step away from becoming part of IEC. 
        <br />
		<ul>
		  <li> Upload a screenshot of your Registration Fee Payment Receipt along with the LEC Agreement in the link below. You must pay Rs.500 Non-Refundable. Payment details & instructions to upload the LEC Agreement are mentioned in the link here: <a href="https://forms.gle/MxkgEd3EufXyy5Gb8" > https://forms.gle/MxkgEd3EufXyy5Gb8</a>   </li>
		  <li> <b> Deadline to Pay the registration fee and sign the LEC Agreement is before 14th August 2023.</b>   </li>
		</ul>
		<br />
		Afterward, you will be contacted shortly with the next step, do keep an eye on your email inbox.
		<br />
		For any further questions or concerns, feel free to contact us at <a href="ask@iec.org.pk">ask@iec.org.pk</a> ask@iec.org.pk or Whatsapp:03338800947
		<br />
		Best Regards, 
		Team Acquisition
		Institute of Emerging Careers 
		<a href="http://www.iec.org.pk" > http://www.iec.org.pk </a> 
		<a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | <a href = "https://www.instagram.com/emergingcareer/">Instagram</a> | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a> </i> `,
		button_announcer: null,
		button_text: null,
		button_link: null,
	})
}

module.exports = {
	sendHTMLMail,
	sendApplicationReceiptEmail,
	sendQuizRejectionEmail,
	sendQuizAcceptanceEmail,
}
