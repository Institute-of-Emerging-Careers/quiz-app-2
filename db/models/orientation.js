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

// OrientationInvite is the Junction model for the Many-to-Many relationship of "Orientation" and "Student" models.

class OrientationInvite extends Model {}
OrientationInvite.init(
  {
    email_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "OrientationInvite",
    hooks: {
      beforeCreate(user) {
        if (user.email_sent == null) user.email_sent = false;
      },
    },
  }
);

module.exports = { Orientation, OrientationInvite };

//all associations are in the user.js and quizmodel.js files because different ordering of loading of these files causes bugs
// see https://stackoverflow.com/questions/50615835/hasmany-called-with-something-thats-not-a-subclass-of-sequelize-model
