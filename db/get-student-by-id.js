const { Student } = require("./models")

const getStudentById = async (id) => {
	try {
		return (
			await Student.findAll({
				where: {
					id: id,
				},
				limit: 1,
			})
		)[0].dataValues
	} catch (err) {
		if (process.env.DEBUG == true) {
			console.log(err)
		}
		return null
	}
}

module.exports = getStudentById
