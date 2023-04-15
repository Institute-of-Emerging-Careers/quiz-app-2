const { Attempt } = require("../db/models")

async function setSectionStatusToComplete(assignment_id, sectionId) {
	const attempt = await Attempt.findOne({
		where: { AssignmentId: assignment_id, SectionId: sectionId },
	})
	return attempt.update({
		endTime: Date.now(),
		duration: Date.now() - attempt.startTime,
		statusText: "Completed",
	})
}

module.exports = { setSectionStatusToComplete }
