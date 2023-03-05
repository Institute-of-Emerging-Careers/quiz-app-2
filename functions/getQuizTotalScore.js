const getTotalMarksOfSection = require('./getTotalMarksOfSection')

function getQuizTotalScore(Quiz) {
	// Quiz must "include" Sections
	let quiz_total_score = 0
	return new Promise((resolve, reject) => {
		try {
			let i = 0
			const n3 = Quiz.Sections.length
			Quiz.Sections.forEach(async (section) => {
				const num_questions_in_section = await section.countQuestions()
				const section_maximum_score = await getTotalMarksOfSection(
					section.id,
					section.poolCount,
					num_questions_in_section
				)
				quiz_total_score += section_maximum_score
				i++
				if (i === n3) resolve(quiz_total_score)
			})
		} catch (err) {
			reject(err)
		}
	})
}

module.exports = getQuizTotalScore
