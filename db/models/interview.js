const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");

class InterviewRound extends Model {}

InterviewRound.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InterviewRound",
  }
);

module.exports = { InterviewRound };

//all associations are in the user.js and quizmodel.js files because different ordering of loading of these files causes bugs
// see https://stackoverflow.com/questions/50615835/hasmany-called-with-something-thats-not-a-subclass-of-sequelize-model
