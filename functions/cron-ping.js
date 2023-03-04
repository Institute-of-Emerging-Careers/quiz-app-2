const cron = require("node-cron")
const {
	Student,
	Invite,
	Assignment,
	Answer,
	Attempt,
	PasswordResetLink,
} = require("../db/models")
const scoreAssignmentsWhoseDeadlineHasPassed = require("./scoreAssignmentsWhoseDeadlineHasPassed")
const {
	scoreAttemptsWhoseTimerHasEnded,
} = require("./scoreAttemptsWhoseTimerHasEnded")
const sendReminderEmails = require("./sendReminderEmails")

const assessment_reminder_mailer_task = cron.schedule(
	"0 0 */3 * * *",
	() => {
		console.log("Running 3-hourly reminder email.")
		sendReminderEmails()
	},
	{
		scheduled: false,
	}
)

const score_past_deadline_attempts = cron.schedule(
	"0 */3 * * * *",
	async () => {
		try {
			console.log(
				"Running 3-minutely script to score past-timer and past-deadline assignments"
			)
			await scoreAttemptsWhoseTimerHasEnded()
			await scoreAssignmentsWhoseDeadlineHasPassed()
		} catch (err) {
			console.log(err)
		}
	},
	{
		scheduled: false,
	}
)

module.exports = {
	assessment_reminder_mailer_task,
	score_past_deadline_attempts,
}
