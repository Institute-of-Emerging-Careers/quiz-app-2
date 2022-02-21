const { Assignment, Attempt, Score } = require("../db/models/user");
const { Quiz, Section } = require("../db/models/quizmodel");

async function scoreAssignmentsWhoseDeadlineHasPassed() {
  const assignments = Assignment.findAll({
    include: [
      { model: Quiz, include: [Section] },
      { model: Attempt, include: [Score] },
    ],
  });
  let promises = [];

  const now = new Date();
  return Promise.all(
    (await assignments).map((assignment) => {
      const timeDiff = now - assignment.createdAt;
      if (timeDiff > 259200000) {
        // 72 hours
        // score all sections of the quiz that this assignment belongs to
        assignment.Quiz.Sections.forEach(async (section) => {
          let attempt = assignment.Attempts.find(
            (attempt) => attempt.SectionId == section.id
          );
          if (
            assignment.Attempts == null ||
            assignment.Attempts.find(
              (attempt) => attempt.SectionId == section.id
            ) == undefined
          ) {
            attempt = await Attempt.create({
              AssignmentId: assignment.id,
              SectionId: section.id,
              startTime: Date.now(),
              endTime: Date.now(),
              duration: 0,
            });
            await assignment.Quiz.update({ allow_edit: false });
          }
          const score = await attempt.getScore();
          if (score == null)
            promises.push(
              scoreSectionAndSendEmail(
                section.id,
                assignment.StudentId,
                assignment
              )
            );
        });
      }
    })
  );
}

module.exports = scoreAssignmentsWhoseDeadlineHasPassed;
