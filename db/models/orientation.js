const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");

const { Quiz } = require("./quizmodel");

class Orientation extends Model {}

Orientation.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Orientation",
  }
);

Quiz.hasOne(Orientation);
Orientation.belongsTo(Quiz);

module.exports = { Orientation };
