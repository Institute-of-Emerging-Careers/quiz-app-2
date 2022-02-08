const { Answer, Student } = require("../db/models/user.js");
const { Question, Section, Passage } = require("../db/models/quizmodel.js");
const {Sequelize} = require("sequelize")

function calculateScore(sectionId, studentId) {
  return new Promise(async (main_resolve, main_reject) => {

    const section = await Section.findOne({where:{id: sectionId}})
    let score = 0.0;
    let questions = await Question.findAll({ where: { SectionId: sectionId }, attributes: ["id", "marks", "type"] });
    if (section.poolCount == questions.length) {
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
    } else {
      // first getting the list of question IDs of all questions in this section
      const all_questions = await Question.findAll({where:{SectionId: sectionId}, attributes:["id"]})
      const all_question_ids = all_questions.map((question)=>question.id)
      

      // now get all answers of this student that are about any of the above questions
      const answers = await Answer.findAll({where:{StudentId: studentId, QuestionId:{[Sequelize.Op.in]:all_question_ids}}, include:[Question]})

      let selected_question_ids = []
        function getQuestionIdsFromArrayOfAnswers(answers) {
          // the problem is that a single MCQ-M question can have multiple Answers
          let question_ids = []
          for (let i=0;i<answers.length;i++) {
            if (answers[i].Question.type == "MCQ-S") question_ids.push(answers[i].Question.id)
            else if (answers[i].Question.type == "MCQ-M") {
              if (question_ids.indexOf(answers[i].Question.id)===-1) {
                question_ids.push(answers[i].Question.id)
              }
            }
          }
          return question_ids
        }
        
        selected_question_ids = getQuestionIdsFromArrayOfAnswers(answers)
        
        function getQuestionObjectsFromArrayOfQuestionIds(question_ids) {
          return new Promise(resolve=>{
            let result = []
            let i=0;
            let n = question_ids.length
            question_ids.forEach(question_id=>{
              Question.findOne({where:{id:question_id}, include:[Passage]})
              .then((question)=>{
                result.push(question)
                i++
                if (i==n) resolve(result)
              })
            })
          })
        }
        questions = await getQuestionObjectsFromArrayOfQuestionIds(selected_question_ids)

        let count_questions = 0;
        questions.forEach(async (question) => {
          if (question.type == "MCQ-S") {
            const student_answer = await Answer.findOne({ where: { QuestionId: question.id, StudentId: studentId }, order: [["id", "desc"]] });
            if (student_answer != null) {
              const student_answer_option = await student_answer.getOption({ attributes: ["correct"] });
              if (student_answer_option!=null && student_answer_option.correct) {
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
        })
      }
  });
}

module.exports = calculateScore;
