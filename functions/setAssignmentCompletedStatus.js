const { Quiz, Section } = require("../db/models/quizmodel");
const { Assignment, Student, Attempt } = require("../db/models/user");

async function setAssignmentCompletedStatus(quiz_id) {
  const quiz = await Quiz.findOne({
    where: { id: quiz_id },
    include: [
      { model: Assignment, where: { completed: false }, include: [Attempt] },
      Section,
    ],
  });
  const assignments = quiz.Assignments;
  return Promise.all(
    assignments.map((assignment) => {
      if (
        assignment.Attempts.length == quiz.Sections.length &&
        assignment.Attempts.reduce((final, cur) => {
          if (!final) return false;
          if (cur.statusText != "Completed") return false;
        }, true)
      ) {
        return assignment.update({ completed: true });
      }
    })
  );
}

// setAssignmentCompletedStatus(36)
//   .then(() => {
//     console.log("done");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = setAssignmentCompletedStatus;
