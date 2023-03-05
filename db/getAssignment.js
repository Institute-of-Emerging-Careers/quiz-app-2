const {
	User,
	Student,
	Invite,
	Assignment,
	Answer,
	Quiz,
	Section,
	Question,
	Option,
} = require("./models")

const getAssignment = (studentId, quizId, includes) => {
	return Assignment.findOne({
		where: {
			StudentId: studentId,
			QuizId: quizId,
		},
		include: includes,
	})
}

module.exports = getAssignment
