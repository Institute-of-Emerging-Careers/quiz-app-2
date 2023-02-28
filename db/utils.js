const autoAssignQuiz = async (userApplication, Assignment) => {
	const round = await userApplication.getApplicationRound()
	if (!round.auto_assigned_quiz_id) return new Promise((resolve) => resolve())
	if (userApplication.StudentId && userApplication.id)
		return Assignment.create({
			QuizId: round.auto_assigned_quiz_id,
			StudentId: userApplication.StudentId,
			ApplicationId: userApplication.id,
		})
	else
		return new Promise((resolve, reject) =>
			reject(
				"Critical Error in auto Quiz Assignment: Either the quizId or the StudentId was null."
			)
		)
}

module.exports = { autoAssignQuiz }
