const { Quiz } = require("../db/models")
const { removeEverythingInQuiz } = require("./saveExistingQuiz")

async function deleteQuiz(id, t) {
	return new Promise(async (resolve, reject) => {
		let the_quiz
		try {
			the_quiz = await Quiz.findOne(
				{
					where: {
						id: id,
					},
				},
				{ transaction: t }
			)
			if (the_quiz.countSections() > 0) {
				removeEverythingInQuiz(the_quiz, t)
					.then(() => {
						Quiz.destroy(
							{
								where: {
									id: id,
								},
							},
							{ transaction: t }
						)
							.then(() => {
								resolve(true)
							})
							.catch((err) => {
								console.log(err)
								reject(err)
							})
					})
					.catch((err) => {
						console.log(err)
						reject(err)
					})
			} else {
				return Quiz.destroy(
					{
						where: {
							id: id,
						},
					},
					{ transaction: t }
				)
					.then(() => {
						resolve(true)
					})
					.catch((err) => {
						console.log(err)
						reject(err)
					})
			}
		} catch (err) {
			console.log(err)
			reject(err)
		}
	})
}

module.exports = deleteQuiz
