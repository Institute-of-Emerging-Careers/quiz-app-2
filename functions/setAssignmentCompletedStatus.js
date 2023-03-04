const { Op } = require("sequelize")
const { Quiz, Section, Assignment, Attempt } = require("../db/models")

async function setAssignmentCompletedStatus(quiz_id) {
	const quiz = await Quiz.findOne({
		where: { id: quiz_id },
		include: [
			{
				model: Assignment,
				where: { completed: false },
				include: [Attempt],
			},
			Section,
		],
	})
	if (quiz == null)
		return new Promise((resolve) => {
			resolve()
		})

	const assignments = quiz.hasOwnProperty("Assignments")
		? quiz.Assignments
		: null
	return Promise.all(
		assignments == null
			? [
					new Promise((resolve) => {
						resolve()
					}),
			  ]
			: assignments.map((assignment) => {
					if (
						assignment.Attempts.length == quiz.Sections.length &&
						assignment.Attempts.reduce((final, cur) => {
							if (!final) return false
							else if (cur.statusText != "Completed") return false
							else return true
						}, true)
					) {
						return assignment.update({ completed: true })
					} else {
						return assignment.update({ completed: false })
					}
			  })
	)
}

/* setAssignmentCompletedStatus(36)
   .then(() => {
     console.log("done");
   })
   .catch((err) => {
     console.log(err);
   });
*/

module.exports = setAssignmentCompletedStatus
