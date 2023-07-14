const { DateTime } = require("luxon")
const { Quiz, Student, Assignment } = require("../db/models")
const allSectionsSolved = require("./allSectionsSolved")
const { queueMail } = require("../bull")
const sequelize = require("sequelize")
const { Op } = require("sequelize")

async function sendReminderEmails() {
	try {
		const quizzes = await Quiz.findAll({
			where: {
				sendReminderEmails: true,
			},
			include: [
				{
					model: Assignment,
					where: {
						[Op.and]: [
							sequelize.literal(
								"UNIX_TIMESTAMP() - 0 > (24*60*60)"
							),
							{ completed: false },
						],
					},

					include: [
						{
							model: Student,
							attributes: ["email"],
						},
					],
					//i.e. if it has been more than 37 hours since last reminder email and assignment has not been completed yet
				},
			],
		})

		if (quizzes != null && quizzes.length != 0) {
			let promises = quizzes.map((quiz) => {
				if (quiz.Assignments != null && quiz.Assignments.length != 0) {
					return quiz.Assignments.map((assignment) => {
						//432 00 000 = 12 hours

						// now check if student still has an unsolved section

						const all_sections_solved = assignment.completed
						if (!all_sections_solved) {
							const deadline = DateTime.fromMillis(
								new Date(assignment.createdAt).getTime()
							).plus({ days: process.env.QUIZ_DEADLINE_FROM_SIGNUP_IN_DAYS }) //timeOfAssignment + Quiz deadline time

							const deadline_diff = deadline
								.diff(DateTime.now(), ["days", "hours", "minutes"])
								.toObject()
							const remaining_days = deadline_diff.days
							const remaining_hours = deadline_diff.hours
							let remaining_time_in_words = `${remaining_days} day`
							if (remaining_days != 1) remaining_time_in_words += "s"
							remaining_time_in_words += ` ${remaining_hours} hour`
							if (remaining_hours != 1) remaining_time_in_words += "s"

							if (
								remaining_days > 0 &&
								remaining_days < process.env.QUIZ_DEADLINE_FROM_SIGNUP_IN_DAYS
							) {
								//if remaining time more than 0 days and less than x days then send email, because we don't want to be sending reminder emails to students whose env.QUIZ_DEADLINE_FROM_SIGNUP_IN_DAYS have already passed

								console.log(
									`Sending email. Time left: ${remaining_days} days and ${remaining_hours} hours`
								)

								// send reminder mail
								return [
									queueMail(
										assignment.Student.email,
										`IEC: Complete Your Assessment`,
										{
											heading: "IEC Assessment Due",
											inner_text: `<i>Dear Student,<br><br />

											You have been assigned Assessments that you have to complete within 5 days of your registration. <b> This is a final follow-up! </b> <br /><br />
											<b> In- case you do not complete the Assessment in time you will be disqualified. </b> <br /><br />
											
											The assessment is designed to test your basic English language and critical thinking skills. Make sure to go through the assessment guide for your understanding. <br /><br />
											
											<b> Assessment Guide Link: </b>  <a href="https://iec.org.pk/testing" > Assessment Guide </a> <br /><br />
											
											<b> Assessment Link: </b>  <a href="https://iec.org.pk/testing" > Assessment Link </a> <br /><br />
											
											Best of luck with the assessment! <br /><br />
											
											Are you excited to start this journey with us? <br /><br />
											
											For any further questions or concerns, feel free to contact us at <a href="ask@iec.org.pk">ask@iec.org.pk</a> or Whatsapp:03338800947 <br /><br />
											
											Best Regards, <br /><br />
											Team Acquisition <br /><br />
											Institute of Emerging Careers <br /><br />
											<a href="http://www.iec.org.pk" > http://www.iec.org.pk </a>  <br /><br />
											<a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | <a href = "https://www.instagram.com/emergingcareer/">Instagram</a> | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a> <i/>`,
											button_announcer:
												"Log into your student portal to complete assessment",
											button_text: "Login",
											button_link: "https://apply.iec.org.pk/student",
										}
									),

									assignment.update({
										timeOfLastReminderEmail: Date.now(),
									}),
								]
							}
						}
					})
				} else return []
			})
			promises = promises.reduce((final, cur) => {
				return [...final, ...cur]
			}, [])
			return Promise.all(promises)
		} else {
			console.log("No reminder emails to send.")
		}
	} catch (err) {
		console.log(err)
	}
}


module.exports = sendReminderEmails
