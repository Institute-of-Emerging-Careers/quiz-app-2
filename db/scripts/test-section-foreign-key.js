const Section = require("../models/section");
const Quiz = require("../models/quiz");

async function test() {
  const obj = await Section.findAll({
    where: {
      id: 1,
    },
  });

  console.log(obj);

  const quiz = await obj.getQuiz();
  console.log(quiz);
}

test();
