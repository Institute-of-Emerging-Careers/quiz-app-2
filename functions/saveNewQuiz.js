const { Quiz, Section, Question, Option, Passage } = require('../db/models')
const sequelize = require('../db/connect')

async function saveEverythingInQuiz(newquiz, req, t) {
	return new Promise(async (resolve, reject) => {
		try {
			await new Promise((resolve) => {
				let count_passages = 0
				const total_passages = req.body.passages.length
				if (total_passages === 0) resolve()
				else
					req.body.passages.forEach(async (passage, passage_index) => {
						const passage_object = await Passage.create({
							statement: passage.statement,
							place_after_question: passage.place_after_question,
						})
						req.body.passages[passage_index].passage_object = passage_object
						count_passages++
						if (count_passages === total_passages) resolve()
					})
			})

			req.body.mcqs.forEach(async (data_section) => {
				const newsection = await Section.create(
					{
						title: data_section.sectionTitle,
						poolCount: data_section.poolCount,
						sectionOrder: data_section.sectionOrder,
						time: data_section.time,
						QuizId: newquiz.id,
					},
					{ transaction: t }
				)

				data_section.questions.forEach(async (question) => {
					const newquestion = await Question.create(
						{
							statement: question.statement,
							questionOrder: question.questionOrder,
							SectionId: newsection.id,
							type: question.type,
							image: question.image,
							marks: question.marks,
							link_url: question.link.url,
							link_text: question.link.text,
							PassageId:
								question.passage !== null
									? req.body.passages[question.passage].passage_object.id
									: null,
						},
						{ transaction: t }
					)

					question.options.forEach(async (option, optionIndex, array) => {
						if (option.optionStatement != null) {
							await Option.create(
								{
									statement: option.optionStatement,
									optionOrder: option.optionOrder,
									QuestionId: newquestion.id,
									correct: option.correct,
									image: option.image,
								},
								{ transaction: t }
							)
							if (optionIndex === array.length - 2) {
								resolve()
							}
						}
					})
				})
			})
		} catch (err) {
			reject(err)
		}
	})
}

const saveNewQuiz = async (req, res) => {
	const t = await sequelize.transaction()

	try {
		const newquiz = await Quiz.create(
			{
				title: req.body.quizTitle,
			},
			{ transaction: t }
		)

		saveEverythingInQuiz(newquiz, req, t)
			.then(async () => {
				await t.commit()
				res.json({
					status: true,
					message: 'Quiz Saved Successfully',
					quizId: newquiz.id,
				})
			})
			.catch(async (err) => {
				await t.rollback()
				console.log('Error 02', err)
				res.json({ status: false, message: 'Error02' })
			})
	} catch (err) {
		t.rollback().then(() => {
			console.log('Something went wrong\n\n\n')
			console.log(err)
			res.json({ status: false, message: 'Quiz Not Saved' })
		})
	}
}

module.exports = { saveNewQuiz, saveEverythingInQuiz }
