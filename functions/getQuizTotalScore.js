const getTotalMarksOfSection = require("./getTotalMarksOfSection");

function sumArray(array) {
  let sum = 0;
  for (const item of array) {
    sum += item;
  }
  return sum;
}

async function getQuizTotalScore(Quiz) {
  // Quiz must "include" Sections.
  const num_questions_per_section = await Promise.all(Quiz.Sections.map(section => section.countQuestions()))
  const section_total_scores = await Promise.all(num_questions_per_section.map((numQuestions, i) => getTotalMarksOfSection(
    Quiz.Sections[i].id,
    Quiz.Sections[i].poolCount,
    numQuestions
  )))
  const total_score = sumArray(section_total_scores)
  return total_score
}

module.exports = getQuizTotalScore;
