const { Assignment, Attempt, Score, Student } = require("../db/models/user");
const { Quiz, Section } = require("../db/models/quizmodel");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const scoreSection = require("./scoreSectionAndSendEmail");
const allSectionsSolved = require("./allSectionsSolved");

async function scoreAssignmentsWhoseDeadlineHasPassed() {
  const assignments = await Assignment.findAll({
    include: [
      { model: Quiz, include: [Section] },
      { model: Attempt, include: [Score] },
      { model: Student },
    ],
    where: {
      [Op.and]: [
        sequelize.literal(
          "TIME_TO_SEC(TIMEDIFF(NOW(),Assignment.createdAt)) > (30*24*60*60)"
        ),
        { completed: false },
      ],
    },
  });

  let promises = [];
  let completed_assignment_ids = [];

  await new Promise((resolve) => {
    let i = 0;
    const n = assignments.length;
    if (i == n) resolve();
    assignments.map(async (assignment) => {
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
            statusText: "Completed",
          });
          if (assignment.Quiz.allow_edit)
            await assignment.Quiz.update({ allow_edit: false });
        }
        const score = await attempt.getScore();
        if (score == null) {
          promises.push(
            scoreSection(section.id, assignment.StudentId, assignment, false)
          );
        } else {
          const all_sections_solved = await allSectionsSolved(
            assignment.QuizId,
            assignment
          );
          if (all_sections_solved) completed_assignment_ids.push(assignment.id);
        }
        i++;
        if (i == n) resolve();
      });
    });
  });

  if (completed_assignment_ids.length > 0) {
    await Assignment.update({
      completed: true,
      where: {
        id: {
          [Op.in]: completed_assignment_ids,
        },
      },
    });
  }
  return Promise.all(promises);
}

// scoreAssignmentsWhoseDeadlineHasPassed()
//   .then(() => {
//     console.log("done");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = scoreAssignmentsWhoseDeadlineHasPassed;
