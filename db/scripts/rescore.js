const { Quiz, Section } = require("../models/quizmodel");
const { Assignment, Attempt, Score } = require("../models/user");
const calculateScore = require("../../functions/calculateScore");

(async () => {
  const quiz = await Quiz.findOne({
    where: { id: 34 },
    include: [
      {
        model: Assignment,
        include: [{ model: Attempt, where: { statusText: "Completed" } }],
      },
    ],
  });

  let arr_of_section_student_pairs = [];
  quiz.Assignments.forEach((assignment) => {
    const student_id = assignment.StudentId;
    assignment.Attempts.forEach((attempt) => {
      arr_of_section_student_pairs.push([
        attempt.SectionId,
        student_id,
        attempt.id,
      ]);
    });
  });

  await new Promise((resolve) => {
    let i = 0;
    const n = arr_of_section_student_pairs.length;
    arr_of_section_student_pairs.forEach(async (pair) => {
      const score = await calculateScore(pair[0], pair[1]);
      let scoreObject = await Score.findOne({ where: { AttemptId: pair[2] } });
      if (scoreObject != null) {
        scoreObject.set({ score: score });
        await scoreObject.save();
      }
      i++;
      if (i == n) resolve();
    });
  });
  console.log("done");
})();
