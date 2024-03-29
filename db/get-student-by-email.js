const { Student } = require("./models")

const getStudentByEmail = async (inputemail) => {
	try {
		return (
			await Student.findAll({
				where: {
					email: inputemail,
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

module.exports = getStudentByEmail
