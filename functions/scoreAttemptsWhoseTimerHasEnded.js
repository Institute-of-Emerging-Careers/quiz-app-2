const { Section } = require("../db/models/quizmodel");
const { Op } = require("sequelize");
const { Attempt, Assignment, Score } = require("../db/models/user");
const scoreSection = require("./scoreSectionAndSendEmail");

function filterTimerEndedAttempts(attempts) {
  return attempts.filter((attempt) => attempt.endTime - Date.now() <= 100);
}

async function scoreAttemptsWhoseTimerHasEnded() {
  console.log("scoreAttemptsWhoseTimerHasEnded")
  let attempts;
  try {
    attempts = await Attempt.findAll({
      where: {
        statusText: {
          [Op.ne]: "Completed",
        },
        AssignmentId: {
          [Op.ne]: null,
        },
        endTime: {
          [Op.ne]: 0,
        },
      },
      include: [
        { model: Assignment, attributes: ["StudentId"] },
        { model: Section, attributes: ["id"] },
        { model: Score, attributes: ["id"] },
      ],
      attributes: ["endTime", "AssignmentId"],
    });

    return Promise.all(
      filterTimerEndedAttempts(attempts).map((attempt) =>
        scoreSection(attempt.Section.id, attempt.Assignment.StudentId)
      )
    );
  } catch (err) {
    console.log(err);
  }
}

// scoreAttemptsWhoseTimerHasEnded()
//   .then(() => {
//     console.log("done");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = { scoreAttemptsWhoseTimerHasEnded, filterTimerEndedAttempts };
