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
										`Reminder | IEC Assessment Deadline`,
										{
											heading: "IEC Assessment Due",
											inner_text: `Dear Student,<br>

											You have been assigned Assessments that you have to complete within 72 hours of your registration. 

											This is a final follow-up. The assessment is designed to test your basic English language and critical thinking skills.  In-case you do not complete the Assessment in time you will be disqualified. You only have ${remaining_time_in_words} to solve the IEC Assessment.<br>If you have already completed the assessment, you can ignore this email. 

											For any further questions or concerns, feel free to contact us at ask@iec.org.pk or Whatsapp: 03338800947
											
											Best Regards, 
											Team Acquisition
											Institute of Emerging Careers 
											http://www.iec.org.pk 
											<a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | <a href = "https://www.instagram.com/emergingcareer/">Instagram</a> | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a>`,
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
