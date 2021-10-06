const Quiz = require("../models/quiz");
const Section = require("../models/section");
const Question = require("../models/question");
const Option = require("../models/option");

const test = async () => {
  console.log(1);
  await Quiz.hasMany(Section);
  console.log(2);
  await Section.belongsTo(Quiz);

  await Section.hasMany(Question);
  await Question.belongsTo(Section);

  await Question.hasMany(Option);
  await Option.belongsTo(Question);
};

test();
