const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");

class ApplicationRound extends Model {}

ApplicationRound.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ApplicationRound",
  }
);

class Course extends Model {}

Course.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Course",
  }
);

// junction table for ApplicaitonRound and Course (many-to-many relationship)
class ApplicationRoundCourseJunction extends Model {}
// continue here as well
ApplicationRoundCourseJunction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  { sequelize, modelName: "ApplicationRoundCourseJunction" }
);

module.exports = {
  ApplicationRound,
  Course,
  ApplicationRoundCourseJunction,
};
