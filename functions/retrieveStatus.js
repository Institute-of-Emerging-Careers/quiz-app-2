const { Attempt } = require("../db/models")

async function retrieveStatus(assignment, sectionId) {
	const attempt = await Attempt.findOne({
		where: {
			AssignmentId: assignment.id,
			SectionId: sectionId,
		},
	})

	if (attempt == null || attempt.statusText == "Not Started")
		return ["Not Started", "Start"]
	else if (attempt.statusText == "In Progress")
		return ["In Progress", "Continue"]
	else if (attempt.statusText == "Completed") return ["Completed", ""]
	else return ["Unknown", ""]
}

module.exports = retrieveStatus
