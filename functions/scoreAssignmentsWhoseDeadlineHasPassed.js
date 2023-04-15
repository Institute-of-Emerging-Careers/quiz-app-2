const {
	Assignment,
	Attempt,
	Score,
	Student,
	Quiz,
	Section,
} = require("../db/models")
const { Op } = require("sequelize")
const sequelize = require("sequelize")
const scoreSection = require("./scoreSectionAndSendEmail")
const allSectionsSolved = require("./allSectionsSolved")

async function scoreAssignmentsWhoseDeadlineHasPassed() {
	console.log("scoreAssignmentsWhoseDeadlineHasPassed")
	try {
		return new Promise(async (resolve) => {
			const assignments = await Assignment.findAll({
				include: [
					{ model: Quiz, include: [Section] },
					{ model: Attempt, include: [Score] },
					{ model: Student },
				],
				where: {
					[Op.and]: [
						sequelize.literal("DATEDIFF(NOW(),`Assignment`.`createdAt`) > 29"),
						{ completed: false },
					],
				},
			})
			let completed_assignment_ids = []

			let i = 0
			const n = assignments.length
			if (i == n) {
				resolve()
			} else {
				assignments.map(async (assignment) => {
					// 72 hours
					// score all sections of the quiz that this assignment belongs to
					await new Promise((minor_resolve) => {
						let i2 = 0
						const n2 = assignment.Quiz.Sections.length
						assignment.Quiz.Sections.forEach(async (section) => {
							let attempt = assignment.Attempts.find(
								(attempt) => attempt.SectionId == section.id
							)
							if (
								assignment.Attempts == null ||
								assignment.Attempts.find(
									(attempt) => attempt.SectionId == section.id
								) == undefined
							) {
								attempt = await Attempt.create({
									AssignmentId: assignment.id,
									SectionId: section.id,
									startTime: Date.now(),
									endTime: Date.now(),
									duration: 0,
									statusText: "Completed",
								})
								if (assignment.Quiz.allow_edit)
									await assignment.Quiz.update({ allow_edit: false })
							}
							const score = await attempt.getScore()
							if (score == null) {
								await scoreSection(
									section.id,
									assignment.StudentId,
									assignment,
									false
								)
							}
							i2++
							if (i2 == n2) minor_resolve()
						})
					})
					const all_sections_solved = await allSectionsSolved(
						assignment.QuizId,
						assignment
					)
					if (all_sections_solved) completed_assignment_ids.push(assignment.id)
					i++
					if (i == n && completed_assignment_ids.length == 0) resolve()
					else if (i == n && completed_assignment_ids.length > 0) {
						await Assignment.update(
							{
								completed: true,
							},
							{
								where: {
									id: {
										[Op.in]: completed_assignment_ids,
									},
								},
							}
						)
						resolve()
					}
				})
			}
		})
	} catch (err) {
		console.log(err)
		return new Promise((resolve, reject) => {
			reject(err)
		})
	}
}

// scoreAssignmentsWhoseDeadlineHasPassed()
//   .then(() => {
//     console.log("done");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = scoreAssignmentsWhoseDeadlineHasPassed
