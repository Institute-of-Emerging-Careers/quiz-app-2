const express = require("express")
const router = express.Router()
const moment = require("moment")

//My Requirements
const checkAdminAuthenticated = require("../db/check-admin-authenticated")
const checkStudentAuthenticated = require("../db/check-student-authenticated")
const checkInterviewerAuthenticated = require("../db/check-interviewer-authenticated")
const checkAnyoneAuthenticated = require("../db/check-anyone-authenticated")
const {
	Quiz,
	Section,
	Question,
	Option,
	Passage,
	Student,
	Invite,
	Assignment,
	Answer,
	Attempt,
	Score,
	Application,
} = require("../db/models")
const { saveNewQuiz } = require("../functions/saveNewQuiz.js")
const { saveExistingQuiz } = require("../functions/saveExistingQuiz.js")
const getStudentScore = require("../functions/getStudentScore.js")
const { sendQuizRejectionEmail, sendQuizAcceptanceEmail } = require("../functions/sendEmail.js")
const calculateSingleAssessmentStatus = require("../functions/calculateSingleAssessmentStatus")
const deleteQuiz = require("../functions/deleteQuiz")
const saveQuizProgress = require("../functions/saveQuizProgress")
const setSectionStatusToInProgress = require("../functions/setSectionStatusToInProgress")
const retrieveStatus = require("../functions/retrieveStatus")
const scoreSection = require("../functions/scoreSectionAndSendEmail")
const {
	getQuizResults,
	getQuizResultsWithAnalysis,
} = require("../functions/getQuizResults")
const getAssignment = require("../db/getAssignment")
const getSection = require("../db/getSection")
const {
	millisecondsToMinutesAndSeconds,
} = require("../functions/millisecondsToMinutesAndSeconds")

const sequelize = require("../db/connect.js")
const { Sequelize } = require("sequelize")

const {
	getQuestionObjectsFromArrayOfQuestionIds,
	getQuestionIdsFromArrayOfAnswers,
} = require("../functions/utilities.js")
const allSectionsSolved = require("../functions/allSectionsSolved.js")
const { queueMail } = require("../bull")
const { Op } = require("sequelize")
const emailStudentOnSectionCompletion = require("../functions/emailStudentOnSectionCompletion")

// middleware that is specific to this router
router.use((req, res, next) => {
	next()
})

router.get("/new", checkAdminAuthenticated, (req, res) => {
	res.render("new_quiz.ejs", { quizId: "", user_type: req.user.type })
})

router.get(
	"/all-titles-and-num-attempts",
	checkAdminAuthenticated,
	(req, res) => {
		let data = []

		// We're going to return the names and number_of_attempts of all quizzes.
		Quiz.findAll({
			attributes: ["id", "title", "createdAt"],
			order: [["id", "desc"]],
		})
			.then((quizzes) => {
				let promises = quizzes.map((quiz) => {
					return quiz.countAssignments()
				})
				Promise.all(promises)
					.then((num_assignments_array) => {
						res.json(
							quizzes.map((quiz, i) => {
								let copy = JSON.parse(JSON.stringify(quiz))
								copy["num_assignments"] = num_assignments_array[i]
								return copy
							})
						)
					})
					.catch((err) => {
						res.sendStatus(500)
						console.log(err)
					})
			})
			.catch((err) => {
				console.log(err)
				res.sendStatus(500)
			})
	}
)

router.get("/all-titles", checkAdminAuthenticated, async (req, res) => {
	let quizzes
	try {
		quizzes = await Quiz.findAll({
			attributes: ["id", "title", "createdAt"],
			order: [["id", "desc"]],
		})
	} catch (err) {
		console.log("error: ", err)
		res.sendStatus(500)
		return
	}
	res.json(quizzes)
})

router.get("/edit/:quizId", checkAdminAuthenticated, (req, res) => {
	res.render("new_quiz.ejs", {
		quizId: req.params.quizId,
		user_type: req.user.type,
	})
})

router.get("/state/:quizId", checkAdminAuthenticated, async (req, res) => {
	/*
	Target:
	[
	  {
		  sectionTitle: sectionInput,
		  poolCount: 0,
		  questions: [
			  {
				  passage: null,
				  statement: null,
				  type: type,
				  image:null,
				  link:{url:null, text:null}
				  options: [
					  { optionStatement: "option 1", correct: true},
					  { optionStatement: null, correct: false }
				  ],
			  }
		  ],
	  }
	]
	*/

	function findAndReturnPassageIndexFromPassagesArrayUsingPassageId(
		passages_object,
		passage_db_id
	) {
		for (
			let passage_index = 0;
			passage_index < passages_object.length;
			passage_index++
		) {
			if (passages_object[passage_index].id == passage_db_id)
				return passage_index
		}
		return null
	}

	let passages_object = []
	try {
		const data = await Quiz.findOne({
			where: {
				id: req.params.quizId,
			},
			include: [
				{
					model: Section,
					attributes: ["id"],
					include: [
						{
							model: Question,
							attributes: ["id"],
							include: [
								{
									model: Passage,
									order: [["place_after_question", "ASC"]],
								},
							],
						},
					],
				},
			],
		})

		data.Sections.forEach((section) => {
			section.Questions.forEach((question) => {
				if (question.Passage != null)
					passages_object.push({
						id: question.Passage.id,
						statement: question.Passage.statement,
						place_after_question: question.Passage.place_after_question,
					})
			})
		})
	} catch (err) {
		console.log(err)
	}

	let stateObject = []
	try {
		const quiz = await Quiz.findOne({
			where: {
				id: req.params.quizId,
			},
		})

		const sections = await quiz.getSections({
			order: [["sectionOrder", "ASC"]],
		})
		for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
			stateObject.push({
				id: sections[sectionIndex].id,
				sectionTitle: sections[sectionIndex].title,
				sectionOrder: sections[sectionIndex].sectionOrder,
				poolCount: sections[sectionIndex].poolCount,
				time: sections[sectionIndex].time,
				questions: [],
			})

			const questions = await sections[sectionIndex].getQuestions({
				order: [["questionOrder", "ASC"]],
			})
			for (
				let questionIndex = 0;
				questionIndex < questions.length;
				questionIndex++
			) {
				stateObject[sectionIndex].questions.push({
					id: questions[questionIndex].id,
					passage:
						questions[questionIndex].PassageId != null
							? findAndReturnPassageIndexFromPassagesArrayUsingPassageId(
								passages_object,
								questions[questionIndex].PassageId
							)
							: null,
					statement: questions[questionIndex].statement,
					questionOrder: questions[questionIndex].questionOrder,
					image: questions[questionIndex].image,
					type: questions[questionIndex].type,
					marks: questions[questionIndex].marks,
					link: {
						url: questions[questionIndex].link_url,
						text: questions[questionIndex].link_text,
					},
					options: [],
				})

				const options = await questions[questionIndex].getOptions({
					order: [["optionOrder", "ASC"]],
				})
				for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
					stateObject[sectionIndex].questions[questionIndex].options.push({
						id: options[optionIndex].id,
						optionStatement: options[optionIndex].statement,
						optionOrder: options[optionIndex].optionOrder,
						correct: options[optionIndex].correct,
						edit: options[optionIndex].statement == null ? true : false,
						image: options[optionIndex].image,
					})
				}
				stateObject[sectionIndex].questions[questionIndex].options.push({
					optionStatement: null,
					correct: false,
				})
			}
		}

		res.json({
			success: true,
			stateObject: stateObject,
			passages_object: passages_object,
			quizTitle: quiz.title,
		})
	} catch (err) {
		res.json({ success: false })
	}
})

router.get("/duplicate/:quizId", checkAdminAuthenticated, async (req, res) => {
	const old_quiz = await Quiz.findOne({
		where: { id: req.params.quizId },
		include: {
			model: Section,
			include: {
				model: Question,
				include: [Option, Passage],
			},
		},
	})

	const t = await sequelize.transaction()

	const new_quiz = await Quiz.create(
		{
			title: old_quiz.title + " - copy",
			modified_by: req.user.user.id,
		},
		{ transaction: t }
	)

	let count_created = 0 //total entities that have been created at a given time
	let total_required = 0 //total entities that exist in this quiz

	await new Promise((resolve, reject) => {
		total_required += old_quiz.Sections.length
		old_quiz.Sections.forEach((old_section) => {
			Section.create(
				{
					sectionOrder: old_section.sectionOrder,
					title: old_section.title,
					poolCount: old_section.poolCount,
					time: old_section.time,
					QuizId: new_quiz.id,
				},
				{ transaction: t }
			)
				.then((new_section) => {
					count_created++
					total_required += old_section.Questions.length
					old_section.Questions.forEach(async (old_question) => {
						let new_passage_id = null
						if (old_question.Passage != null) {
							let old_passage = await old_question.getPassage()
							new_passage_id = (
								await Passage.create(
									{
										statement: old_passage.statement,
										place_after_question: old_passage.place_after_question,
									},
									{ transaction: t }
								)
							).id
						}
						Question.create(
							{
								PassageId: new_passage_id,
								SectionId: new_section.id,
								questionOrder: old_question.questionOrder,
								statement: old_question.statement,
								type: old_question.type,
								marks: old_question.marks,
								image: old_question.image,
								link_url: old_question.link_url,
								link_text: old_question.link_text,
							},
							{ transaction: t }
						)
							.then((new_question) => {
								count_created++
								total_required += old_question.Options.length
								old_question.Options.forEach((old_option) => {
									Option.create(
										{
											QuestionId: new_question.id,
											optionOrder: old_option.optionOrder,
											statement: old_option.statement,
											correct: old_option.correct,
											image: old_option.image,
										},
										{ transaction: t }
									)
										.then(async (new_option) => {
											count_created++
											if (count_created == total_required) {
												resolve()
												await t.commit()
											}
										})
										.catch(async (err) => {
											reject(err)
											await t.rollback()
										})
								})
							})
							.catch(async (err) => {
								reject(err)
								await t.rollback()
							})
					})
				})
				.catch(async (err) => {
					reject(err)
					await t.rollback()
				})
		})
	})

	res.redirect("/admin")
})

router.get("/:quizId/details", checkStudentAuthenticated, async (req, res) => {
	try {
		let quiz = await Quiz.findOne({
			where: {
				id: req.params.quizId,
			},
			attributes: [],
			include: [
				{ model: Section, attributes: ["id", "title", "poolCount", "time"] },
				{
					model: Assignment,
					where: {
						StudentId: req.user.user.id,
					},
					attributes: ["id"],
				},
			],
		})

		let final_data = []
		for (let i = 0; i < quiz.Sections.length; i++) {
			const section_id = quiz.Sections[i].id
			const section_title = quiz.Sections[i].title
			const section_time = quiz.Sections[i].time
			const pool = quiz.Sections[i].poolCount
			const status = await retrieveStatus(
				quiz.Assignments[0],
				quiz.Sections[i].id
			)
			final_data.push({
				id: section_id,
				title: section_title,
				num_questions: pool,
				time: section_time,
				status: status,
			})
		}
		res.json(final_data)
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

router.get(
	"/attempt/:quizId/section/:sectionId",
	checkStudentAuthenticated,
	async (req, res) => {
		// getAssignment(studentId, quizId, [what_other_models_to_include_in_results])
		const assignment = await getAssignment(
			req.user.user.id,
			req.params.quizId,
			[Quiz, Student]
		)
		// checking if 30 days have gone by since the student was assigned this assessment, because that's the deadline
		const now = new Date()
		const timeDiff = now - assignment.createdAt
		const deadline_from_signup = process.env.QUIZ_DEADLINE_FROM_SIGNUP_IN_DAYS //days

		if (timeDiff > deadline_from_signup * 24 * 60 * 60 * 1000) {
			await scoreSection(req.params.sectionId, req.user.user.id, null, true)
			await emailStudentOnSectionCompletion(
				req.params.sectionId,
				assignment.Student.email,
				req.params.quizId,
				assignment
			)

			res.render("templates/error.ejs", {
				additional_info: "Deadline Passed :(",
				error_message: `You had ${deadline_from_signup} days to solve this assessment, and the deadline has passed now. You cannot solve the assessment now.`,
				action_link: "/student",
				action_link_text: "Click here to go to student home page.",
			})
		} else {
			// deadline has not passed, so let student edit quiz if timer has not ended (deadline is 72 hours, timer is the quiz's time in minutes)

			// make this quiz non-editable because someone has started attempting it
			if (assignment.allow_edit)
				await assignment.Quiz.update({ allow_edit: false })

			// Get the section that the student wants to attempt.
			// getSection(sectionId, [what_other_models_to_include_in_results])
			const section = await getSection(req.params.sectionId, [])

			try {
				// check if an Attempt exists for this section (that would mean that this user is currently attempting or has attempted this section)
				// An Attempt is characterized by an AssignmentId and a SectionId
				const attempt = await Attempt.findOne({
					where: {
						AssignmentId: assignment.id,
						SectionId: section.id,
					},
				})

				if (attempt != null) {
					// attempt exists for this section by this student, so we check if there is time remaining
					if (attempt.endTime != 0 && attempt.endTime - Date.now() <= 100) {
						// this means that the section is timed and the time for this section is already over
						await scoreSection(
							req.params.sectionId,
							req.user.user.id,
							null,
							true
						)
						await emailStudentOnSectionCompletion(
							req.params.sectionId,
							assignment.Student.email,
							req.params.quizId,
							assignment
						)
						res.render("templates/error.ejs", {
							additional_info: "Time Limit Over :(",
							error_message:
								"The time for this section of the assessment has ended. You cannot continue to attempt it anymore.",
							action_link: "/student",
							action_link_text: "Click here to go to student home page.",
						})
					} else {
						// the student still has time to continue this section
						res.render("student/attempt.ejs", {
							user_type: req.user.type,
							sectionId: req.params.sectionId,
							sectionTitle: section.title,
							quizTitle: assignment.Quiz.title,
							env: process.env.NODE_ENV,
							previewOrNot: 0,
						})
					}
				} else {
					// the student has never attempted or started to attempt this section before
					function matchAssignmentAndSectionId(assignment_id, section_id) {
						return new Promise(async (resolve) => {
							let found = false
							const assignment = await Assignment.findOne({
								where: { id: assignment_id },
								include: [
									{
										model: Quiz,
										include: [{ model: Section, attributes: ["id"] }],
									},
								],
							})
							assignment.Quiz.Sections.forEach((section) => {
								if (section.id == section_id) found = true
							})
							resolve(found)
						})
					}
					// add this section to sectionStatus
					// confirm that this sectionId belongs to the quiz that this Assignment is linked to
					if (
						await matchAssignmentAndSectionId(
							assignment.id,
							req.params.sectionId
						)
					) {
						await setSectionStatusToInProgress(
							assignment,
							section,
							req.params.sectionId
						)

						res.render("student/attempt.ejs", {
							user_type: req.user.type,
							sectionId: req.params.sectionId,
							sectionTitle: section.title,
							quizTitle: assignment.Quiz.title,
							env: process.env.NODE_ENV,
							previewOrNot: 0,
						})
					} else {
						res.sendStatus(500)
					}
				}
			} catch (err) {
				console.log(err)
				res.send("Error 45. Contact Admin.")
			}
		}
	}
)

router.get(
	"/preview/:quizId/section/:sectionId",
	checkAdminAuthenticated,
	async (req, res) => {
		// Get the section that the student wants to attempt.
		// getSection(sectionId, [what_other_models_to_include_in_results])
		const quiz = await Quiz.findOne({
			where: {
				id: req.params.quizId,
			},
			attributes: ["title"],
			include: {
				model: Section,
				where: { id: req.params.sectionId },
				attributes: ["title"],
				limit: 1,
			},
		})

		try {
			res.render("student/attempt.ejs", {
				user_type: req.user.type,
				sectionId: req.params.sectionId,
				sectionTitle: quiz.Sections[0].title,
				quizTitle: quiz.title,
				env: process.env.NODE_ENV,
				previewOrNot: 1,
			})
		} catch (err) {
			console.log(err)
			res.sendStatus(500)
		}
	}
)

router.get("/preview/:quiz_id", checkAdminAuthenticated, async (req, res) => {
	// Get the section that the student wants to attempt.
	// getSection(sectionId, [what_other_models_to_include_in_results])
	const quiz = await Quiz.findOne({
		where: {
			id: req.params.quiz_id,
		},
		attributes: ["title"],
		include: { model: Section, attributes: ["id", "title"] },
	})

	try {
		res.render("admin/preview.ejs", {
			user_type: req.user.type,
			quiz_id: req.params.quiz_id,
			quiz_title: quiz.title,
			sections: quiz.Sections,
		})
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

router.get(
	"/section/:sectionId/all-questions",
	checkAnyoneAuthenticated,
	async (req, res) => {
		// add check to see if quiz is available at this moment, if student is assigned to this quiz
		// if student has already solved this quiz, etc.

		let section = await Section.findOne({
			where: {
				id: req.params.sectionId,
			},
			order: [[Question, "questionOrder", "asc"]],
			include: [
				Quiz,
				{
					model: Question,
					required: true,
					include: [Passage],
				},
			],
		})

		let selected_question_indexes = []
		let final_questions_array = []
		let result = []
		let passages = []

		if (section.poolCount < section.Questions.length) {
			// first getting the list of question IDs of all questions in this section
			const all_questions = await Question.findAll({
				where: { SectionId: req.params.sectionId },
				attributes: ["id"],
			})
			const all_question_ids = all_questions.map((question) => question.id)

			// now get all answers of this student that are about any of the above questions
			const answers = await Answer.findAll({
				where: {
					StudentId: req.user.user.id,
					QuestionId: { [Sequelize.Op.in]: all_question_ids },
				},
				include: [Question],
			})

			if (answers.length == 0) {
				// student hasn't attempted this section before so we create a new randomized sequence of questions

				// generating p random numbers in a [low,high] range where p=poolCount, low=0 and high=total_num_questions
				function generateUniqueRandomNumbersInRange(
					number_of_random_numbers,
					start_of_range,
					end_of_range
				) {
					let random_numbers = []

					for (let i = 0; i < number_of_random_numbers; i++) {
						let question_no
						do {
							question_no = parseInt(
								Math.random() * (end_of_range - start_of_range) + start_of_range
							)
						} while (random_numbers.indexOf(question_no) !== -1)
						random_numbers.push(question_no)
					}
					return random_numbers
				}

				selected_question_indexes = generateUniqueRandomNumbersInRange(
					section.poolCount,
					0,
					section.Questions.length - 1
				)

				function getArrayElementsUsingArrayOfIndexes(
					main_array,
					array_of_indexes
				) {
					// array_of_indexes contains index numbers of the main_array. We return a new array that only contains those indexe
					let new_array = []
					for (let i = 0; i < array_of_indexes.length; i++) {
						new_array.push(main_array[array_of_indexes[i]])
					}
					return new_array
				}

				final_questions_array = getArrayElementsUsingArrayOfIndexes(
					section.Questions,
					selected_question_indexes
				)

				// to save these selected questions, we create empty answers (Question-Student mapping)
				function createEmptyAnswersForArrayOfQuestions(array_of_questions) {
					return new Promise((resolve) => {
						const n = array_of_questions.length
						let i = 0
						array_of_questions.forEach(async (question) => {
							await Answer.create({
								QuestionId: question.id,
								StudentId: req.user.user.id,
								OptionId: 1,
							})
							i++
							if (i == n) resolve()
						})
					})
				}

				await createEmptyAnswersForArrayOfQuestions(final_questions_array)

				// constructing a results array to send
				let prev_passage = null
				let prev_passage_index = null
				let passage_id_to_array_index_mapping = {}

				// constructing unique passages array
				for (let i = 0; i < section.poolCount; i++) {
					if (final_questions_array[i].Passage != null) {
						if (prev_passage != final_questions_array[i].Passage.id) {
							prev_passage = final_questions_array[i].Passage.id
							prev_passage_index = passages.push({
								id: final_questions_array[i].Passage.id,
								statement: final_questions_array[i].Passage.statement,
								place_after_question:
									final_questions_array[i].Passage.place_after_question,
							})

							prev_passage_index--
							passage_id_to_array_index_mapping[
								final_questions_array[i].Passage.id
							] = prev_passage_index
						}
					}
				}

				// adding questions right now so that their order does not get messed up due to out-of-order fulfilment of promises in the loop below
				for (let i = 0; i < section.poolCount; i++) {
					result.push({
						question: {
							id: final_questions_array[i].id,
							questionOrder: section.Questions[i].questionOrder,
							statement: final_questions_array[i].statement,
							type: final_questions_array[i].type,
							marks: final_questions_array[i].marks,
							image: final_questions_array[i].image,
							link_url: final_questions_array[i].link_url,
							link_text: final_questions_array[i].link_text,
							passage: passage_id_to_array_index_mapping.hasOwnProperty(
								final_questions_array[i].PassageId
							)
								? passage_id_to_array_index_mapping[
								final_questions_array[i].PassageId
								]
								: null,
						},
						options: [],
						answer: -1, //student's old answers, not the correct answers
					})
				}

				let count = 0
				await new Promise((resolve, reject) => {
					for (let i = 0; i < section.poolCount; i++) {
						Option.findAll({
							where: { QuestionId: final_questions_array[i].id },
							order: [["optionOrder", "asc"]],
						})
							.then(async (options_array) => {
								result[i].options = options_array
								if (final_questions_array[i].type == "MCQ-M") {
									let default_answers_array = []
									options_array.forEach((opt) => {
										default_answers_array.push(false)
									})
									result[i].answer = default_answers_array
								}
								count++
								if (count == section.poolCount) resolve(result)
							})
							.catch((err) => {
								console.log(err)
								reject()
							})
					}
				})
			} else {
				// student has started/finished this section so we get the already chosen set of questions

				let selected_question_ids = []
				selected_question_ids = getQuestionIdsFromArrayOfAnswers(answers)
				final_questions_array = await getQuestionObjectsFromArrayOfQuestionIds(
					selected_question_ids
				)

				// constructing a results array to send
				let prev_passage = null
				let prev_passage_index = null
				let passage_id_to_array_index_mapping = {}

				// constructing unique passages array
				for (let i = 0; i < section.poolCount; i++) {
					if (final_questions_array[i].Passage != null) {
						if (prev_passage != final_questions_array[i].Passage.id) {
							prev_passage = final_questions_array[i].Passage.id
							prev_passage_index = passages.push({
								id: final_questions_array[i].Passage.id,
								statement: final_questions_array[i].Passage.statement,
								place_after_question:
									final_questions_array[i].Passage.place_after_question,
							})

							prev_passage_index--
							passage_id_to_array_index_mapping[
								final_questions_array[i].Passage.id
							] = prev_passage_index
						}
					}
				}

				// adding questions right now so that their order does not get messed up due to out-of-order fulfilment of promises in the loop below
				for (let i = 0; i < section.poolCount; i++) {
					result.push({
						question: {
							id: final_questions_array[i].id,
							questionOrder: final_questions_array[i].questionOrder,
							statement: final_questions_array[i].statement,
							type: final_questions_array[i].type,
							marks: final_questions_array[i].marks,
							image: final_questions_array[i].image,
							link_url: final_questions_array[i].link_url,
							link_text: final_questions_array[i].link_text,
							passage: passage_id_to_array_index_mapping.hasOwnProperty(
								final_questions_array[i].PassageId
							)
								? passage_id_to_array_index_mapping[
								final_questions_array[i].PassageId
								]
								: null,
						},
						options: [],
						answer: -1, //student's old answers, not the correct answers
					})
				}

				let count = 0
				await new Promise((resolve, reject) => {
					for (let i = 0; i < section.poolCount; i++) {
						Option.findAll({
							where: { QuestionId: final_questions_array[i].id },
							order: [["optionOrder", "asc"]],
						})
							.then(async (options_array) => {
								if (final_questions_array[i].type == "MCQ-S") {
									// student may have already attempted this quiz partly, so we are getting his/her old answer
									const old_answer = await Answer.findOne({
										where: {
											StudentId: req.user.user.id,
											QuestionId: final_questions_array[i].id,
										},
										attributes: ["OptionId"],
									})

									result[i].options = options_array
									if (old_answer != null) result[i].answer = old_answer.OptionId
								} else if (final_questions_array[i].type == "MCQ-M") {
									const old_answers = await Answer.findAll({
										where: {
											StudentId: req.user.user.id,
											QuestionId: final_questions_array[i].id,
										},
										attributes: ["OptionId"],
										order: [["OptionId", "asc"]],
									})
									let default_answers_array = [] //all false
									if (old_answers == null) {
										options_array.forEach((opt) => {
											default_answers_array.push(false)
										})
									} else {
										options_array.forEach((opt) => {
											let found = false
											old_answers.forEach((old_answer) => {
												if (opt.id == old_answer.OptionId) {
													found = true
												}
											})
											default_answers_array.push(found)
										})
									}
									result[i].options = options_array
									result[i].answer = default_answers_array
								}
								count++
								if (count == section.poolCount) resolve(result)
							})
							.catch((err) => {
								console.log(err)
								reject()
							})
					}
				})
			}
		} else {
			// constructing a results array to send
			let prev_passage = null
			let prev_passage_index = null
			let passage_id_to_array_index_mapping = {}

			// constructing unique passages array
			for (let i = 0; i < section.poolCount; i++) {
				if (section.Questions[i].Passage != null) {
					if (prev_passage != section.Questions[i].Passage.id) {
						prev_passage = section.Questions[i].Passage.id
						prev_passage_index = passages.push({
							id: section.Questions[i].Passage.id,
							statement: section.Questions[i].Passage.statement,
							place_after_question:
								section.Questions[i].Passage.place_after_question,
						})

						prev_passage_index--
						passage_id_to_array_index_mapping[section.Questions[i].Passage.id] =
							prev_passage_index
					}
				}
			}

			// adding questions right now so that their order does not get messed up due to out-of-order fulfilment of promises in the loop below
			for (let i = 0; i < section.poolCount; i++) {
				result.push({
					question: {
						id: section.Questions[i].id,
						questionOrder: section.Questions[i].questionOrder,
						statement: section.Questions[i].statement,
						type: section.Questions[i].type,
						marks: section.Questions[i].marks,
						image: section.Questions[i].image,
						link_url: section.Questions[i].link_url,
						link_text: section.Questions[i].link_text,
						passage: passage_id_to_array_index_mapping.hasOwnProperty(
							section.Questions[i].PassageId
						)
							? passage_id_to_array_index_mapping[
							section.Questions[i].PassageId
							]
							: null,
					},
					options: [],
					answer: -1, //student's old answers, not the correct answers
				})
			}

			let count = 0
			await new Promise((resolve, reject) => {
				for (let i = 0; i < section.poolCount; i++) {
					Option.findAll({
						where: { QuestionId: section.Questions[i].id },
						order: [["optionOrder", "asc"]],
					})
						.then(async (options_array) => {
							if (section.Questions[i].type == "MCQ-S") {
								// student may have already attempted this quiz partly, so we are getting his/her old answer
								const old_answer = await Answer.findOne({
									where: {
										StudentId: req.user.user.id,
										QuestionId: section.Questions[i].id,
									},
									attributes: ["OptionId"],
								})

								result[i].options = options_array
								if (old_answer != null) result[i].answer = old_answer.OptionId
							} else if (section.Questions[i].type == "MCQ-M") {
								const old_answers = await Answer.findAll({
									where: {
										StudentId: req.user.user.id,
										QuestionId: section.Questions[i].id,
									},
									attributes: ["OptionId"],
									order: [["OptionId", "asc"]],
								})
								let default_answers_array = [] //all false
								if (old_answers == null) {
									options_array.forEach((opt) => {
										default_answers_array.push(false)
									})
								} else {
									options_array.forEach((opt) => {
										let found = false
										old_answers.forEach((old_answer) => {
											if (opt.id == old_answer.OptionId) {
												found = true
											}
										})
										default_answers_array.push(found)
									})
								}
								result[i].options = options_array
								result[i].answer = default_answers_array
							}
							count++
							if (count == section.poolCount) resolve(result)
						})
						.catch((err) => {
							console.log(err)
							reject()
						})
				}
			})
		}

		res.json({ success: true, data: result, passages: passages })
	}
)

router.get(
	"/section/:sectionId/endTime",
	checkStudentAuthenticated,
	async (req, res) => {
		// getting the endTime of this quiz
		try {
			const section = await Section.findOne({
				where: {
					id: req.params.sectionId,
				},
				attributes: ["id", "QuizId"],
			})

			const assignment = await Assignment.findOne({
				where: {
					StudentId: req.user.user.id,
					QuizId: section.QuizId,
				},
				attributes: ["id"],
			})

			const attempt = await Attempt.findOne({
				where: { AssignmentId: assignment.id, SectionId: req.params.sectionId },
				attributes: ["endTime", "startTime"],
			})
			let endTime = attempt.endTime

			if (attempt.endTime == null) {
				endTime = 0
			}
			const startTime = attempt.startTime
			let duration_left
			if (attempt.endTime == null || attempt.endTime == 0) {
				duration_left = 0
			} else {
				duration_left = attempt.endTime - Date.now()
			}

			res.json({
				success: true,
				endTime: endTime,
				duration_left: duration_left,
			})
		} catch (err) {
			console.log(err)
			res.json({ success: false })
		}
	}
)

router.post("/save-progress", checkStudentAuthenticated, (req, res) => {
	// add check to see if student still is allowed to solve this quiz (depending on time)
	const answers = req.body.answers

	saveQuizProgress(answers, req)
		.then(() => {
			// time is time of submission
			res.json({ success: true, time: Date.now() })
		})
		.catch((err) => {
			console.log(err)
			res.json({ success: false })
		})
})

router.post(
	"/edit-reminder-setting",
	checkAdminAuthenticated,
	async (req, res) => {
		try {
			const quiz = await Quiz.findOne({ where: { id: req.body.quiz_id } })
			if (quiz != null) {
				const cur_reminder_setting =
					req.body.current_reminder_setting == "true" ? true : false
				const new_reminder_setting = !cur_reminder_setting
				quiz.sendReminderEmails = new_reminder_setting
				await quiz.save()
				res.json({ success: true, new_reminder_setting: new_reminder_setting })
			} else res.json({ success: false })
		} catch (err) {
			res.json({ success: false })
			console.log(err)
		}
	}
)

router.get(
	"/reset-section-attempt/:student_id/:section_id",
	async (req, res) => {
		try {
			const section = await Section.findOne({
				where: { id: req.params.section_id },
				include: [Quiz, Question],
			})
			const assignment = await Assignment.findOne({
				where: { StudentId: req.params.student_id, QuizId: section.Quiz.id },
			})

			const attempt = await Attempt.findOne({
				where: {
					AssignmentId: assignment.id,
					SectionId: req.params.section_id,
				},
				include: [Score],
			})

			if (attempt != null) {
				if (attempt.Score != null) await attempt.Score.destroy()
				await attempt.destroy()
			}
			if (assignment.completed) await assignment.update({ completed: false })
			await Promise.all(
				section.Questions.map((question) =>
					Answer.destroy({
						where: {
							QuestionId: question.id,
							StudentId: req.params.student_id,
						},
					})
				)
			)

			res.sendStatus(200)
		} catch (err) {
			res.sendStatus(500)
			console.log(err)
		}
	}
)

router.get(
	"/attempt/:sectionId/score",
	checkStudentAuthenticated,
	async (req, res) => {
		// answers are already saved in Database, so we create a Score object and send student completion email
		await scoreSection(req.params.sectionId, req.user.user.id, null, true)
		const section = await Section.findOne({
			where: { id: req.params.sectionId },
			attributes: ["id"],
			include: [Quiz],
		})
		const assignment = await Assignment.findOne({
			where: { QuizId: section.Quiz.id, StudentId: req.user.user.id },
			attributes: ["id"],
		})
		const all_sections_solved = await allSectionsSolved(
			section.Quiz.id,
			assignment
		)

		const [obtainedScore, totalScore] = await getStudentScore(assignment.id)

		const percentage = (obtainedScore / totalScore) * 100

		//get the student's email
		const student = await Student.findOne({
			where: { id: req.user.user.id },
			attributes: ["email"],
		})

		if (all_sections_solved && percentage < 50.0) {
			await sendQuizRejectionEmail(student.email)
		} else {
			await sendQuizAcceptanceEmail(student.email)
		}

		res.json({ success: true, all_sections_solved: all_sections_solved })
	}
)

router.get("/:quizId/results", checkAdminAuthenticated, async (req, res) => {
	res.render("admin/quiz/view_results.ejs", {
		user_type: req.user.type,
		user_id: req.user.user.id,
		quiz_id: req.params.quizId,
		myname: req.user.user?.firstName,
		env: process.env.NODE_ENV,
	})
})

router.get("/:quizId/results-data", checkAdminAuthenticated, (req, res) => {
	getQuizResults(req.params.quizId)
		.then((data) => {
			res.json(data)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
})

router.get("/:quiz_id/analysis", checkAdminAuthenticated, async (req, res) => {
	const final_response = await getQuizResultsWithAnalysis(req.params.quiz_id)

	res.render("admin/view_result_analysis.ejs", {
		user_type: req.user.type,
		myname: req.user.user?.firstName,
		data_obj: final_response,
		moment: moment,
		millisecondsToMinutesAndSeconds: millisecondsToMinutesAndSeconds,
	})
})

router.post("/create-invite", checkAdminAuthenticated, async (req, res) => {
	if (req.body.quizId != null && req.body.url != null && req.body.url != "") {
		try {
			const new_invite = await Invite.create({
				link: req.body.url,
				QuizId: req.body.quizId,
			})
			if (new_invite != null)
				res.json({
					success: true,
					message: "Link created successfully.",
					invite: new_invite,
				})
			else
				res.json({
					success: false,
					message: "Invite not created. There was an error.",
				})
		} catch (err) {
			console.log(err)
			if (err.errors[0].type == "unique violation") {
				res.json({
					success: false,
					message: "This link is already in use. Create a different one.",
				})
			} else {
				res.json({
					success: false,
					message: "An unexpected error has occured.",
				})
			}
		}
	} else {
		res.json({ success: false, message: "Please enter a valid url." })
	}
})

router.get(
	"/registrations/:link",
	checkAdminAuthenticated,
	async (req, res) => {
		const invite = await Invite.findOne({
			where: { link: req.params.link },
			attributes: ["id"],
			include: [
				{
					model: Student,
					attributes: [
						"id",
						"firstName",
						"lastName",
						"email",
						"cnic",
						"createdAt",
					],
				},
				Quiz,
			],
		})

		await new Promise((resolve) => {
			let count = 0
			invite.Students.forEach(async (student, index) => {
				const assignment = await Assignment.findOne({
					where: { StudentId: student.id, QuizId: invite.Quiz.id },
				})
				const num_sections = await invite.Quiz.countSections()
				const attempted_sections = await Attempt.findAndCountAll({
					where: { AssignmentId: assignment.id },
				})
				const [status, action] = calculateSingleAssessmentStatus(
					attempted_sections,
					num_sections
				)
				invite.Students[index].status = status
				count++
				if (count == invite.Students.length) resolve()
			})
		})

		res.render("admin/view_registrations.ejs", {
			user_type: req.user.type,
			students: invite.Students,
			full_link: process.env.SITE_DOMAIN_NAME + "/" + req.params.link,
		})
	}
)

router.post("/save", checkAdminAuthenticated, async (req, res) => {
	if (req.body.quizId == null) {
		// if new quiz being created
		saveNewQuiz(req, res)
	} else {
		// if old quiz being updated
		const quiz = await Quiz.findOne({
			where: {
				id: req.body.quizId,
			},
		})
		if (quiz.allow_edit) saveExistingQuiz(req, res)
		else
			res.send({
				message:
					"Quiz could not be edited. At least 1 student has already attempted it or is attempting it. Please duplicate the quiz and make changes to the new quiz.",
				status: false,
				quizId: quiz.id,
			})
	}
})

router.get("/delete/:id", checkAdminAuthenticated, async (req, res) => {
	const t = await sequelize.transaction()
	try {
		await deleteQuiz(req.params.id, t)
		t.commit()
		res.redirect("/admin")
	} catch (err) {
		t.rollback()
		res.redirect("/admin?error=delete")
		console.log("Error deleting quiz.")
	}
})

router.get("/assign/:quiz_id", checkAdminAuthenticated, async (req, res) => {
	try {
		const quiz = await Quiz.findOne({ where: { id: req.params.quiz_id } })
		if (quiz == null) {
			res.render("templates/error.ejs", {
				additional_info: "Incorrect URL",
				error_message:
					"The quiz mentioned in the URL does not exist. Please return to the admin home page and try again.",
				action_link: "/admin",
				action_link_text: "Click here to go to admin home page.",
			})
			return
		}

		res.render("admin/quiz/assign.ejs", {
			quiz_id: req.params.quiz_id,
			myname: req.user.user?.firstName,
			user_type: req.user.type,
			env: process.env.NODE_ENV,
			current_url: `/admin/application${req.url}`,
		})
	} catch (err) {
		res.render("templates/error.ejs", {
			additional_info: "Something went wrong",
			error_message: "Please talk to the IT Team about this.",
			action_link: "/admin",
			action_link_text: "Click here to go to admin home page.",
		})
		console.log(err)
	}
})

router.post("/assign/:quiz_id", checkAdminAuthenticated, async (req, res) => {
	try {
		const quiz = await Quiz.findOne({ where: { id: req.params.quiz_id } })
		if (quiz == null) {
			res.sendStatus(400)
			return
		}
	} catch (err) {
		res.sendStatus(500)
		console.log(err)
	}

	// req.body.list_of_student_ids_to_be_added is a 2D array. Each element array is [student_id, application_id].
	// One student may have many applications. So while creating an assignment, we must know which application is relevant here.
	Promise.all(
		req.body.list_of_student_ids_to_be_added.map((elem_arr) => {
			const [student_id, application_id] = elem_arr
			return Assignment.findOrCreate({
				where: {
					QuizId: req.params.quiz_id,
					StudentId: student_id,
					ApplicationId: application_id,
				},
			})
		})
	)
		.then(() => {
			res.sendStatus(201)
		})
		.catch((err) => {
			res.sendStatus(500)
		})
})

router.get(
	"/all-assignees/:quiz_id",
	checkAdminAuthenticated,
	async (req, res) => {
		try {
			const quiz = await Quiz.findOne({ where: { id: req.params.quiz_id } })
			if (quiz == null) {
				res.sendStatus(401)
				return
			}
			let assignments = await quiz.getAssignments({
				include: [
					{
						model: Student,
						attributes: ["id", "firstName", "lastName", "email", "cnic"],
					},
				],
				raw: true,
			})

			res.status(200).json(assignments)
		} catch (err) {
			res.sendStatus(500)
			console.log(err)
		}
	}
)

router.post(
	"/send-emails/:quiz_id",
	checkAdminAuthenticated,
	async (req, res) => {
		const email_content = req.body.email_content
		let emails =
			req.body.hasOwnProperty("applications") && req.body.applications
				? req.body.users.map((application) => {
					return {
						email_address: application.Student.email,
						application_id: application.id,
					}
				})
				: req.body.users.map((user) => {
					return { email_address: user.email, application_id: null }
				})

		const application_ids = emails.map((email_obj) => email_obj.application_id)

		if (emails.length == 0) {
			res.sendStatus(200)
			return
		}

		let promises = emails.map((email_obj) =>
			queueMail(email_obj.email_address, `${email_content.subject}`, {
				heading: email_content.heading,
				inner_text: email_content.body,
				button_announcer: email_content.button_pre_text,
				button_text: email_content.button_label,
				button_link: `${process.env.SITE_DOMAIN_NAME}/student/login`,
			})
		)
		promises.push(
			Application.update(
				{ assessment_email_sent: true },
				{ where: { id: { [Op.in]: application_ids } } }
			)
		)

		Promise.all(promises)
			.then(() => {
				res.sendStatus(200)
			})
			.catch((err) => {
				console.log(err)
				res.sendStatus(500)
			})
	}
)

module.exports = router
