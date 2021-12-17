const { Sequelize, DataTypes, Model } = require("sequelize");
const { Quiz, Question, Option, Section } = require("./quizmodel");
const sequelize = require("../connect");

class User extends Model {}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
    modelName: "User",
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

class Student extends Model {}

Student.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cnic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Student",
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

class Invite extends Model {}

Invite.init(
  {
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Invite",
    indexes: [{ unique: true, fields: ["link"] }],
  }
);

class Assignment extends Model {}

Assignment.init(
  {
    status: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sectionStatus: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    scores: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Assignment",
  }
);

class Attempt extends Model {}

// An Attempt is the attempt of just a single section out of a quiz
Attempt.init(
  {
    statusText: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Not Started"
    },
    startTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "Attempt",
  }
);

class Score extends Model {}

// An Attempt is the attempt of just a single section out of a quiz
Score.init(
  {
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: "Score",
  }
);

class Answer extends Model {}

Answer.init({}, { sequelize, modelName: "Answer" });


// Quiz, Student, and Invite relationships
Quiz.hasMany(Invite, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Invite.belongsTo(Quiz);

Student.belongsTo(Invite);

// Student, Assignment, and Quiz relationships
Student.hasMany(Assignment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
});
Assignment.belongsTo(Student);
Quiz.hasMany(Assignment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
});
Assignment.belongsTo(Quiz);

// Student, Question, Option and Answer relationship
Question.hasMany(Answer, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    allowNull: false,
  },
});
Answer.belongsTo(Question);

Student.hasMany(Answer, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
});
Answer.belongsTo(Student);

Option.hasMany(Answer, {
  onDelete: "RESTRICT",
  onUpdate: "NO ACTION",
  foreignKey: {
    allowNull: false,
  },
});
Answer.belongsTo(Option);


// Assignment and Attempt relationship
Assignment.hasMany(Attempt, {})
Attempt.belongsTo(Assignment)

// Attempt and Section relationship
Section.hasMany(Attempt, {
  foreignKey: {
    allowNull: false,
  },
})
Attempt.belongsTo(Section)

// Attempt and Score relationship
Attempt.hasOne(Score)
Score.belongsTo(Attempt)


module.exports = { User, Student, Invite, Assignment, Answer, Attempt, Score };
