const { Attempt, Score } = require("../db/models/user");

async function updateScore(sectionId, assignment_id,score) {
    let section_attempt = await Attempt.findOne({where:{SectionId: sectionId, AssignmentId: assignment_id}, attributes:["id"]})
    if (section_attempt == null) {
        // this happens when student didn't attempt the assessment within the 72 hour deadline, so an Attempt does not exist.
        // So we create an empty attempt anyway
        section_attempt = await Attempt.create({SectionId: sectionId, AssignmentId: assignment_id, startTime: Date.now()})
    }
    let scoreObject = await Score.findOne({where:{AttemptId: section_attempt.id}})

    if (scoreObject == null) {
        return Score.create({AttemptId: section_attempt.id, score: score})
    } else {
        scoreObject.set({score: score})
        return scoreObject.save()
    }
}

module.exports = updateScore