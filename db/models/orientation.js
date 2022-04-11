const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");

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

module.exports = { Orientation };
