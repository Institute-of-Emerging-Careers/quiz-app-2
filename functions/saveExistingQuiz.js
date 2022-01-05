const { Quiz, Section, Question, Option } = require("../db/models/quizmodel");
const { saveEverythingInQuiz } = require("./saveNewQuiz.js");
const sequelize = require("../db/connect");


function countTheSectionsAndQuestionsAndOptionsInAQuiz(data)
{
  // Note: The quiz must be queried by "include"ing its Sections, Questions, and Options. See saveExistingQuiz.js in start of function removeEverythingInQuiz for precedent
  let num_options = 0;
  let num_questions = 0;
  let num_sections = 0

  data.Sections.forEach(section=>{
    num_sections++
    section.Questions.forEach(question=>{
      num_questions++
      question.Options.forEach(option=>{
        num_options++
      })
    })
  })

  return [num_options, num_questions, num_sections]
}

function deleteAllOptionsInQuiz(data, num_options, t)
{
  let count_options = 0
  return new Promise((resolve,reject)=>{
    data.Sections.forEach(section=>{
      section.Questions.forEach(question=>{
        question.Options.forEach(option=>{
          option.destroy({transaction:t})
          .then(()=>{
            count_options++
            if (count_options == num_options) {
              resolve()
            }
          }).catch(err=>{
            reject(err)
          })
        })
        if (num_options == 0) resolve()
      })
    })
  })
}

function deleteAllQuestionsInQuiz(data, num_questions, t)
{
  let count_questions = 0
  return new Promise((resolve,reject)=>{
    data.Sections.forEach(section=>{
      section.Questions.forEach(question=>{
        question.destroy({transaction:t})
        .then(()=>{
          count_questions++
          if (count_questions == num_questions) {
            resolve()
          }
        }).catch(err=>{
          reject(err)
        })
      })
    })
  })
}

function deleteAllSectionsInQuiz(data, num_sections, t)
{
  let count_sections = 0
    return new Promise((resolve,reject)=>{
      data.Sections.forEach(section=>{
        section.destroy({transaction:t})
        .then(()=>{
          count_sections++
          if (count_sections == num_sections) {
            resolve()
          }
        }).catch(err=>{
          reject(err)
        })
      })
    })
}

async function removeEverythingInQuiz(the_quiz, t) {
  let data = await Quiz.findOne({where:{id:the_quiz.id},
  include: {model: Section, 
  include: {model: Question, 
  include: {model: Option}}}})
  
  let [num_options, num_questions, num_sections] = countTheSectionsAndQuestionsAndOptionsInAQuiz(data)
  
  
  return deleteAllOptionsInQuiz(data, num_options, t)
  .then(()=>
  {
    return deleteAllQuestionsInQuiz(data, num_questions, t)
  }
  ).then(()=>
  {
    return deleteAllSectionsInQuiz(data, num_sections, t)
  })
  .catch(err=>{
    console.log(err)
  })
}

const saveExistingQuiz = async (req, res) => {
  const t = await sequelize.transaction();

  let the_quiz;
  try {
    the_quiz = await Quiz.findOne(
      {
        where: {
          id: req.body.quizId,
        },
      },
      { transaction: t }
    );
  } catch (err) {
    console.log(err);
  }

  if (the_quiz.title != req.body.quizTitle) {
    the_quiz.update({ title: req.body.quizTitle }, { transaction: t });
  }

  if (the_quiz != null) {
    if ((await the_quiz.countSections()) > 0) {
      removeEverythingInQuiz(the_quiz, t)
        .then(() => {
          saveEverythingInQuiz(the_quiz, req, t)
            .then(async () => {
              await t.commit();
              res.send({ message: "Resaved quiz.", status: true, quizId: the_quiz.id });
            })
            .catch(async (err) => {
              await t.rollback();
              console.log("Error 03", err);
              res.send({ message: "Code 02 Error.", status: false, quizId: the_quiz.id });
            });
        })
        .catch(async (err) => {
          await t.rollback();
          console.log("Code 01", err);
          res.send({ message: "Code 01 Error.", status: false, quizId: the_quiz.id });
        });
    } else {
      saveEverythingInQuiz(the_quiz, req, t)
        .then(async () => {
          await t.commit();
          res.send({ message: "Resaved quiz.", status: true, quizId: the_quiz.id });
        })
        .catch(async (err) => {
          await t.rollback();
          console.log("Error 03", err);
          res.send({ message: "Code 02 Error.", status: false, quizId: the_quiz.id });
        });
    }
  } else {
    await t.rollback();
    res.send({ message: "Quiz does not exist.", status: false });
  }
};

module.exports = { saveExistingQuiz, removeEverythingInQuiz };
