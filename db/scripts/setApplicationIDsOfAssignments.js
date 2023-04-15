const { Application, Assignment, Student } = require("../models")

const setApplicationIDsOfAssignments = async () => {
	const assignments = await Assignment.findAll({
		where: { ApplicationId: null },
		include: [
			{
				model: Student,
				include: [
					{
						model: Application,
						limit: 1,
						order: [["id", "desc"]],
					},
				],
			},
		],
	})

	assignments.forEach((assignment) => {
		assignment.ApplicationId =
			assignment.Student.Applications.length > 0
				? assignment.Student.Applications[0].id
				: null
	})

	return Promise.all(assignments.map((assignment) => assignment.save()))
}

setApplicationIDsOfAssignments()
	.then(() => {
		console.log("done")
	})
	.catch((err) => {
		console.log(err)
	})

module.exports = setApplicationIDsOfAssignments
