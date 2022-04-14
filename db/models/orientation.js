const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");

const { Quiz } = require("./quizmodel");
const { Student } = require("./user");

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

// OrientationInvite is the Junction model for the Many-to-Many relationship of "Orientation" and "Student" models.

class OrientationInvite extends Model {}
OrientationInvite.init({}, { sequelize, modelName: "OrientationInvite" });

module.exports = { Orientation, OrientationInvite };

//all associations are in the user.js and quizmodel.js files because different ordering of loading of these files causes bugs
// see https://stackoverflow.com/questions/50615835/hasmany-called-with-something-thats-not-a-subclass-of-sequelize-model
