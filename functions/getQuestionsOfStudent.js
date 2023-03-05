const { Question, Answer } = require('../db/models')
const {
	getQuestionIdsFromArrayOfAnswers,
	getQuestionObjectsFromArrayOfQuestionIds,
} = require('./utilities')
const { Sequelize } = require('sequelize')

async function getQuestionsOfStudent(sectionId, studentId) {
	// first getting the list of question IDs of all questions in this section
	const all_questions = await Question.findAll({
		where: { SectionId: sectionId },
		attributes: ['id'],
	})
	const all_question_ids = all_questions.map((question) => question.id)

	// now get all answers of this student that are about any of the above questions
	const answers = await Answer.findAll({
		where: {
			StudentId: studentId,
			QuestionId: { [Sequelize.Op.in]: all_question_ids },
		},
		include: [Question],
	})
	if (answers.length === 0) {
		return new Promise((resolve) => {
			resolve([])
		})
	}
	let selected_question_ids = []
	selected_question_ids = getQuestionIdsFromArrayOfAnswers(answers)
	return getQuestionObjectsFromArrayOfQuestionIds(selected_question_ids)
}

module.exports = getQuestionsOfStudent
