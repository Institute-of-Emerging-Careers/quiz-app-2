const { Question } = require("../db/models/quizmodel.js");
const sequelize = require("../db/connect.js");

async function getTotalMarksOfSection(section_id, pool_count, num_questions) {
  if (pool_count == num_questions) {
    return new Promise(async (resolve) => {
      const section_total_marks = (
        await Question.findAll({
          where: {
            SectionId: section_id,
          },
          attributes: [
            [sequelize.fn("SUM", sequelize.col("marks")), "total_marks"],
          ],
        })
      )[0].dataValues.total_marks;
      resolve(section_total_marks);
    });
  } else {
    return new Promise((resolve) => {
      resolve(pool_count);
    });
  }
}

module.exports = getTotalMarksOfSection;
