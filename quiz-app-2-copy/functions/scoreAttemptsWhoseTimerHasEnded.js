const { Section } = require("../db/models/quizmodel")
const { Attempt, Assignment, Score } = require("../db/models/user")
const scoreSectionAndSendEmail = require("./scoreSectionAndSendEmail")

async function scoreAttemptsWhoseTimerHasEnded() {
    let attempts;
    try {
        attempts = await Attempt.findAll({include:[{model: Assignment, attributes:["StudentId"]}, {model: Section, attributes: ["id"]}, {model: Score, attributes: ["id"]}], attributes: ["endTime", "AssignmentId"]})
    } catch(err) {
        console.log(err)
    }
    return new Promise(resolve=>{
        try {
            console.log("starting")
            let i=0;
            const n = attempts.length
            attempts.forEach(async (attempt)=>{
                if (attempt.Score == null && attempt.AssignmentId!=null && attempt.statusText!="Completed") {
                    if (attempt.endTime != 0 && attempt.endTime - Date.now() <= 100) {
                        await scoreSectionAndSendEmail(attempt.Section.id, attempt.Assignment.StudentId)
                    }
                    i++
                    if (i==n) resolve()
                }
            })
        } catch(err) {
            console.log(err)
        }
    })
}

module.exports = scoreAttemptsWhoseTimerHasEnded