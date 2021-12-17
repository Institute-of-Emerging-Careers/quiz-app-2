const { Attempt, Score } = require("../db/models/user");

async function updateScore(sectionId, assignment,score) {
    const section_attempt = await Attempt.findOne({where:{SectionId: sectionId, AssignmentId: assignment.id}, attributes:["id"]})
    const scoreObject = await Score.findOne({where:{AttemptId: section_attempt.id}})
    console.log("scoreObject",scoreObject)
    if (scoreObject == null) {
        return Score.create({AttemptId: section_attempt.id, score: score})
    } else {
        scoreObject.set({score: score})
        return scoreObject.save()
    }
}

module.exports = updateScore