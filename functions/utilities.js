const { Question, Passage } = require('../db/models')

function getQuestionIdsFromArrayOfAnswers(answers) {
	// the problem is that a single MCQ-M question can have multiple Answers
	const question_ids = []
	for (let i = 0; i < answers.length; i++) {
		if (answers[i].Question.type === 'MCQ-S')
			question_ids.push(answers[i].Question.id)
		else if (answers[i].Question.type === 'MCQ-M') {
			if (question_ids.indexOf(answers[i].Question.id) === -1) {
				question_ids.push(answers[i].Question.id)
			}
		}
	}
	return question_ids
}

function getQuestionObjectsFromArrayOfQuestionIds(question_ids) {
	return new Promise((resolve) => {
		const result = []
		let i = 0
		const n = question_ids.length
		question_ids.forEach((question_id) => {
			Question.findOne({ where: { id: question_id }, include: [Passage] }).then(
				(question) => {
					result.push(question)
					i++
					if (i === n) resolve(result)
				}
			)
		})
	})
}

function generateRandomNumberInRange(min, max) {
	return Math.random() * (max - min) + min
}

module.exports = {
	getQuestionIdsFromArrayOfAnswers,
	getQuestionObjectsFromArrayOfQuestionIds,
	generateRandomNumberInRange,
}
