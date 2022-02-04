const { Section } = require("../db/models/quizmodel")
const { Attempt, Assignment, Score } = require("../db/models/user")
const scoreSectionAndSendEmail = require("./scoreSectionAndSendEmail")

async function scoreAttemptsWhoseTimerHasEnded() {
    const attempts = await Attempt.findAll({include:[{model: Assignment, attributes:["StudentId"]}, {model: Section, attributes: ["id"]}, {model: Score, attributes: ["id"]}], attributes: ["endTime"]})
    return new Promise(resolve=>{
        let i=0;
        const n = attempts.length
        attempts.forEach(async (attempt)=>{
            if (attempt.Score == null) {
                if (attempt.endTime != 0 && attempt.endTime - Date.now() <= 100) {
                    await scoreSectionAndSendEmail(attempt.Section.id, attempt.Assignment.StudentId)
                }
                i++
                if (i==n) resolve()
            }
        })
    })
}

module.exports = scoreAttemptsWhoseTimerHasEnded