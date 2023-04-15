const { User } = require("./models")

const getAdminByEmail = async (inputemail) => {
	try {
		return (
			await User.findAll({
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

module.exports = getAdminByEmail
