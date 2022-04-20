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

class Interviewer extends Model {}

Interviewer.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Interviewer",
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

// InterviewerInvite is junction model for the many-to-many relationship between "Interviewer" and "InterviewRound"
class InterviewerInvite extends Model {}
InterviewerInvite.init({}, { sequelize, modelName: "InterviewerInvite" });

module.exports = { InterviewRound, Interviewer, InterviewerInvite };

//all associations are in the user.js and quizmodel.js files because different ordering of loading of these files causes bugs
// see https://stackoverflow.com/questions/50615835/hasmany-called-with-something-thats-not-a-subclass-of-sequelize-model
