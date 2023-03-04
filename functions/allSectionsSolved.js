const { Attempt, Section } = require('../db/models')

async function allSectionsSolved(quizId, assignment) {
	if (assignment.completed) {
		return new Promise((resolve) => {
			resolve(true)
		})
	} else {
		const sections = await Section.findAll({ where: { QuizId: quizId } })
		const attempts = await Promise.all(
			sections.map((section) =>
				Attempt.findOne({
					where: { AssignmentId: assignment.id, SectionId: section.id },
				})
			)
		)
		return attempts.every(
			(attempt) => attempt !== null && attempt.statusText === 'Completed'
		)
	}
}

module.exports = allSectionsSolved
