const { Answer } = require("../db/models/user.js");
const { Question } = require("../db/models/quizmodel.js");

function calculateScore(sectionId, studentId) {
  return new Promise(async (main_resolve, main_reject) => {
    let score = 0.0;
    const questions = await Question.findAll({ where: { SectionId: sectionId }, attributes: ["id", "marks", "type"] });
    let count_questions = 0;
    questions.forEach(async (question) => {
      if (question.type == "MCQ-S") {
        const student_answer = await Answer.findOne({ where: { QuestionId: question.id, StudentId: studentId }, order: [["id", "desc"]] });
        if (student_answer != null) {
          const student_answer_option = await student_answer.getOption({ attributes: ["correct"] });
          if (student_answer_option.correct) {
            score += question.marks;
          }
        }
        count_questions++;
        if (count_questions == questions.length) {
          main_resolve(score);
        }
      } else if (question.type == "MCQ-M") {
        let all_correct = true;
        const student_answers = await Answer.findAll({ where: { QuestionId: question.id, StudentId: studentId } });

        console.log(student_answers);
        if (student_answers == null || student_answers.length == 0) {
          count_questions++;
          if (count_questions == questions.length) {
            main_resolve(score);
          }
        } else {
          let count_answers = 0;
          new Promise(async (resolve, reject) => {
            student_answers.every(async (answer) => {
              try {
                const key = await answer.getOption({ attributes: ["correct"] });
                if (!key.correct) {
                  all_correct = false;
                }
                count_answers++;
                if (count_answers == student_answers.length) {
                  resolve(all_correct);
                }
              } catch (err) {
                reject();
              }
            });
          })
            .then((correct) => {
              if (correct) {
                score += question.marks;
              }
              count_questions++;
              if (count_questions == questions.length) {
                main_resolve(score);
              }
            })
            .catch((err) => {
              console.log(err);
              main_reject(err);
            });
        }
      }
    });
  });
}

module.exports = calculateScore;
