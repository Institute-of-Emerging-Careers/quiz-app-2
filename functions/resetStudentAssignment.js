const { Section, Quiz, Question } = require("../db/models/quizmodel");
const { Attempt, Assignment, Answer } = require("../db/models/user");

async function deleteAllAttempts(student_id, quiz_id, t) {
  const assignment = await Assignment.findOne({
    where: { QuizId: quiz_id, StudentId: student_id },
    attributes: ["id"],
  });

  await assignment.update({ completed: false });
  // find all sections' attempts
  const attempts = await Attempt.findAll({
    where: { AssignmentId: assignment.id },
  });

  return new Promise((resolve) => {
    let i = 0;
    const n = attempts.length;
    attempts.forEach(async (attempt) => {
      await attempt.destroy({ transaction: t });
      i++;
      if (i == n) resolve();
    });
  });
}

async function deleteAllAnswers(student_id, quiz_id, t) {
  const quiz = await Quiz.findOne({
    where: { id: quiz_id },
    include: [
      {
        model: Section,
        include: [{ model: Question, attributes: ["id"] }],
        attributes: ["id"],
      },
    ],
    attributes: ["id"],
  });

  return new Promise((main_resolve, main_reject) => {
    let num_sections_done = 0;
    const total_sections = quiz.Sections.length;
    try {
      quiz.Sections.forEach(async (section) => {
        await new Promise((resolve) => {
          let num_questions_done = 0;
          const total_questions = section.Questions.length;
          section.Questions.forEach(async (question) => {
            await Answer.destroy({
              where: { QuestionId: question.id, StudentId: student_id },
              transaction: t,
            });
            num_questions_done++;
            if (num_questions_done == total_questions) resolve();
          });
        });

        num_sections_done++;
        if (num_sections_done == total_sections) main_resolve();
      });
    } catch (err) {
      main_reject(err);
    }
  });
}

async function resetStudentAssignment(student_id, quiz_id, t) {
  // delete Answers
  // delete Attempt. This will automatically delete all Scores.

  try {
    await deleteAllAnswers(student_id, quiz_id, t);
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  }

  return deleteAllAttempts(student_id, quiz_id, t);
}

module.exports = resetStudentAssignment;
