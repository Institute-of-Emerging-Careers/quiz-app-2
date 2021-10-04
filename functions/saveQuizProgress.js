const { response } = require("express");
const { Answer } = require("../db/models/user");

function saveQuizProgress(answers, req) {
  // for async
  let count_questions = 0;

  return new Promise((resolve, reject) => {
    try {
      answers.forEach(async (answer) => {
        if (answer.questionType == "MCQ-S") {
          if (answer.answerOptionId == null || answer.answerOptionId == -1) {
            // if the user chose no answer for this question
            count_questions++;
            if (count_questions == answers.length) {
              resolve();
            }
          } else {
            // check if student already saved an answer to this question
            const old_answer = await Answer.findOne({
              where: {
                StudentId: req.user.user.id,
                QuestionId: answer.questionId,
              },
            });
            let mypromise = null;
            if (old_answer == null) {
              // if student hadn't given an answer to this question before
              mypromise = Answer.create({ StudentId: req.user.user.id, QuestionId: answer.questionId, OptionId: answer.answerOptionId });
            } else if (old_answer.OptionId != answer.answerOptionId) {
              // if the student had given an answer to this question before and (s)he has now changed it
              mypromise = old_answer.update({ OptionId: answer.answerOptionId });
            } else {
              // if student had given an answer to this question before but (s)he hasn't changed it, then do nothing to database
              count_questions++;
              if (count_questions == answers.length) {
                resolve();
              }
            }
            if (mypromise != null) {
              mypromise
                .then(() => {
                  count_questions++;
                  if (count_questions == answers.length) {
                    resolve();
                  }
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            }
          }
        } else if (answer.questionType == "MCQ-M") {
          // for async
          let count_answers = 0;

          // the following will come out to be true if there is nothing in the answer.answerOptionId array
          if (count_answers == answer.answerOptionId.length) {
            count_questions++;
            if (count_questions == answers.length) {
              resolve();
            }
          }

          answer.answerOptionId.forEach(async (one_answer) => {
            // let's first check if this student's answer to this question exists in the database
            await Answer.destroy({
              where: {
                StudentId: req.user.user.id,
                QuestionId: answer.questionId,
              },
            });

            Answer.create({ StudentId: req.user.user.id, QuestionId: answer.questionId, OptionId: one_answer })
              .then(() => {
                count_answers++;
                if (count_answers == answer.answerOptionId.length) {
                  count_questions++;
                  if (count_questions == answers.length) {
                    resolve();
                  }
                }
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          });
        } else {
          console.log("WTF");
          reject(null);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = saveQuizProgress;
