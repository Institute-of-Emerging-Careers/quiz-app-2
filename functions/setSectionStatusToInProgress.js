const { Attempt } = require("../db/models")
const { DateTime, Settings } = require("luxon")

async function setSectionStatusToInProgress(assignment, section, sectionId) {
	let cur_section_status = assignment.sectionStatus
	// if section time is equal to 0, that means that the quiz is untimed.
	if (section.time != 0) {
		// if the section is timed
		Settings.defaultZone = "Asia/Karachi"
		const startTime = DateTime.utc()

		// converting section.time which is in minutes to milliseconds
		const endTime = startTime.plus({ minutes: section.time }).toMillis()

		// creating new rows in the new Attempts table. This will replace the above logic
		return Attempt.create({
			startTime: startTime.toMillis(),
			endTime: endTime,
			statusText: "In Progress",
			AssignmentId: assignment.id,
			SectionId: section.id,
		})
	} else {
		// if the section is untimed
		const startTime = DateTime.utc()

		return Attempt.create({
			startTime: startTime.toMillis(),
			endTime: 0,
			statusText: "In Progress",
			AssignmentId: assignment.id,
			SectionId: section.id,
		})
	}
}

module.exports = setSectionStatusToInProgress
