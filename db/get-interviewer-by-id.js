const { Interviewer } = require("./models")

const getInterviewerById = async (id) => {
	try {
		return (
			await Interviewer.findAll({
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

module.exports = getInterviewerById
