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

const getSection = (sectionId, includes) => {
	return Section.findOne({
		where: {
			id: sectionId,
		},
		include: includes,
	})
}

module.exports = getSection
