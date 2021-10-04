const { Quiz, Section, Question, Option } = require("../db/models/quizmodel");
const { saveExistingQuiz, removeEverythingInQuiz } = require("./saveExistingQuiz");
const sequelize = require("../db/connect");

async function deleteQuiz(id) {
  const t = await sequelize.transaction();
  let the_quiz;
  try {
    the_quiz = await Quiz.findOne(
      {
        where: {
          id: id,
        },
      },
      { transaction: t }
    );
    if (the_quiz.countSections() > 0) {
      try {
        await removeEverythingInQuiz(the_quiz, t);
      } catch (err) {
        t.rollback().then(() => {
          console.log(err);
          return false;
        });
      }
    }
    try {
      await Quiz.destroy(
        {
          where: {
            id: id,
          },
        },
        { transaction: t }
      );
      await t.commit();
      return true;
    } catch (err) {
      t.rollback().then(() => {
        console.log(err);
        return false;
      });
    }
  } catch (err) {
    t.rollback().then(() => {
      console.log(err);
      return false;
    });
  }
}

module.exports = deleteQuiz;
