const { Quiz, Assignment, Attempt } = require('../db/models')
const scoreSection = require('./scoreSectionAndSendEmail')

async function rescoreAssignments(quiz_id) {
	try {
		const quiz = await Quiz.findOne({ where: { id: quiz_id } })
		const assignments = await Assignment.findAll({
			where: { QuizId: quiz.id },
		})

		let attempts = assignments.map((assignment) =>
			Attempt.findAll({
				where: { AssignmentId: assignment.id },
				include: [Assignment],
			})
		)
		attempts = await Promise.all(attempts)
		attempts = attempts.reduce((final, cur) => [...final, ...cur], [])

		return Promise.all(
			attempts.map((attempt) =>
				scoreSection(
					attempt.SectionId,
					attempt.Assignment.StudentId,
					null,
					false
				)
			)
		)
	} catch (err) {
		console.log('err0r')
		console.log(err)
	}
}

module.exports = rescoreAssignments
