const { Quiz, Section, Question, Option, Passage } = require("../db/models")
const { saveEverythingInQuiz } = require("./saveNewQuiz.js")
const sequelize = require("../db/connect")

function countTheComponentsInAQuiz(data) {
	// Note: The quiz must be queried by "include"ing its Sections, Questions, and Options. See saveExistingQuiz.js in start of function removeEverythingInQuiz for precedent
	let num_options = 0
	let num_questions = 0
	let num_sections = 0
	let num_passages = 0

	data.Sections.forEach((section) => {
		num_sections++
		section.Questions.forEach((question) => {
			num_questions++
			question.Options.forEach((option) => {
				num_options++
			})
			if (question.Passage != null) num_passages++
		})
	})

	return [num_options, num_questions, num_sections, num_passages]
}

function deleteAllOptionsInQuiz(data, num_options, t) {
	let count_options = 0
	return new Promise((resolve, reject) => {
		data.Sections.forEach((section) => {
			section.Questions.forEach((question) => {
				question.Options.forEach((option) => {
					option
						.destroy({ transaction: t })
						.then(() => {
							count_options++
							if (count_options == num_options) {
								resolve()
							}
						})
						.catch((err) => {
							reject(err)
						})
				})
				if (num_options == 0) resolve()
			})
		})
	})
}

function deleteAllQuestionsInQuiz(data, num_questions, t) {
	let count_questions = 0
	return new Promise((resolve, reject) => {
		data.Sections.forEach((section) => {
			section.Questions.forEach((question) => {
				question
					.destroy({ transaction: t })
					.then(() => {
						count_questions++
						if (count_questions == num_questions) {
							resolve()
						}
					})
					.catch((err) => {
						reject(err)
					})
			})
		})
	})
}

function deleteAllSectionsInQuiz(data, num_sections, t) {
	let count_sections = 0
	return new Promise((resolve, reject) => {
		data.Sections.forEach((section) => {
			section
				.destroy({ transaction: t })
				.then(() => {
					count_sections++
					if (count_sections == num_sections) {
						resolve()
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
	})
}

function deleteAllComprehensionPassagesInQuiz(data, num_passages, t) {
	let count_passages = 0
	return new Promise((resolve, reject) => {
		if (num_passages == 0) resolve()
		else
			data.Sections.forEach((section) => {
				section.Questions.forEach(async (question) => {
					if (question.Passage != null) {
						let passage_temp_store = question.Passage
						await question.update({ PassageId: null })
						passage_temp_store
							.destroy({ transaction: t })
							.then(() => {
								count_passages++
								if (count_passages == num_passages) {
									resolve()
								}
							})
							.catch((err) => {
								reject(err)
							})
					}
				})
			})
	})
}

async function removeEverythingInQuiz(the_quiz, t) {
	let data = await Quiz.findOne({
		where: { id: the_quiz.id },
		include: {
			model: Section,
			include: { model: Question, include: [Option, Passage] },
		},
	})

	let [num_options, num_questions, num_sections, num_passages] =
		countTheComponentsInAQuiz(data)

	return deleteAllOptionsInQuiz(data, num_options, t)
		.then(() => {
			return deleteAllComprehensionPassagesInQuiz(data, num_passages, t)
		})
		.then(() => {
			return deleteAllQuestionsInQuiz(data, num_questions, t)
		})
		.then(() => {
			return deleteAllSectionsInQuiz(data, num_sections, t)
		})
}

const saveExistingQuiz = async (req, res) => {
	const t = await sequelize.transaction()

	let the_quiz
	try {
		the_quiz = await Quiz.findOne(
			{
				where: {
					id: req.body.quizId,
				},
			},
			{ transaction: t }
		)
	} catch (err) {
		console.log(err)
	}

	if (the_quiz.title != req.body.quizTitle) {
		the_quiz.update({ title: req.body.quizTitle }, { transaction: t })
	}

	if (the_quiz != null) {
		if ((await the_quiz.countSections()) > 0) {
			removeEverythingInQuiz(the_quiz, t)
				.then(() => {
					saveEverythingInQuiz(the_quiz, req, t)
						.then(async () => {
							await t.commit()
							res.send({
								message: "Resaved quiz.",
								status: true,
								quizId: the_quiz.id,
							})
						})
						.catch(async (err) => {
							await t.rollback()
							console.log("Error 01", err)
							if (err.code == "ER_ROW_IS_REFERENCED_2") {
								res.send({
									message:
										"Error: A student has already solved this quiz and it has been graded. You cannot change the quiz now without deleting that student's attempt.",
									status: false,
									quizId: the_quiz.id,
								})
							} else {
								res.send({
									message: "Code 01 Error. Please contact the tech team.",
									status: false,
									quizId: the_quiz.id,
								})
							}
						})
				})
				.catch(async (err) => {
					await t.rollback()
					console.log("Error 02", err.original.code)
					if (err.original.code == "ER_ROW_IS_REFERENCED_2") {
						res.send({
							message:
								"Error: A student has already solved this quiz and it has been graded. You cannot change the quiz now without deleting that student's attempt.",
							status: false,
							quizId: the_quiz.id,
						})
					} else {
						res.send({
							message: "Code 02 Error. Please contact the tech team.",
							status: false,
							quizId: the_quiz.id,
						})
					}
				})
		} else {
			saveEverythingInQuiz(the_quiz, req, t)
				.then(async () => {
					await t.commit()
					res.send({
						message: "Resaved quiz.",
						status: true,
						quizId: the_quiz.id,
					})
				})
				.catch(async (err) => {
					await t.rollback()
					console.log("Error 03", err)
					res.send({
						message: "Code 03 Error. Please contact the tech team.",
						status: false,
						quizId: the_quiz.id,
					})
				})
		}
	} else {
		await t.rollback()
		res.send({ message: "Quiz does not exist.", status: false })
	}
}

module.exports = { saveExistingQuiz, removeEverythingInQuiz }
