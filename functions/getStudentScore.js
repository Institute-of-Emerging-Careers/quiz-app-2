const { Assignment, Attempt, Section, Score, Question } = require("../db/models")
const getTotalMarksOfSection = require("./getTotalMarksOfSection")

const getAchievedScore = (attempts) => attempts.reduce((sum, attempt) => sum + attempt.Score.score, 0)
const getMaximumScore = async (attempts) => {
    const section_total_scores = await Promise.all(attempts.map(attempt => getTotalMarksOfSection(attempt.Section.id, attempt.Section.poolCount, attempt.Section.Questions.length)
    ))
    return section_total_scores.reduce((sum, cur) => sum + cur, 0)
}

const getStudentScore = async (assignmentId) => {
    const assignment = await Assignment.findOne({ where: { id: assignmentId }, include: [{ model: Attempt, include: [Score, { model: Section, include: [{ model: Question, attributes: ["id"] }] }] }] })
    let student_achieved_score = getAchievedScore(assignment.Attempts)
    let quiz_maximum_score = await getMaximumScore(assignment.Attempts)
    return [student_achieved_score, quiz_maximum_score]
}

module.exports = getStudentScore