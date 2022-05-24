const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");

class Quiz extends Model {}

Quiz.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    allow_edit: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    sendReminderEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
    // Time limit is of sections, not of the quiz itself
  },
  {
    sequelize,
    modelName: "Quiz",
  }
);

class Section extends Model {}

Section.init(
  {
    sectionOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    poolCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
  }
);

class Passage extends Model {}
Passage.init(
  {
    statement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    place_after_question: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    //which question to place this passage after. This is used to inform the PassageQuestionSelector which question numbers to show. If the passage was added when the quiz already had 4 questions, then the passage can be assigned to questions 5 onwards.
  },
  {
    sequelize,
  }
);


class Question extends Model {}

Question.init(
  {
    questionOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "MCQ-S",
    },
    marks: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
    image: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    link_url: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    link_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Question",
  }
);

class Option extends Model {}

Option.init(
  {
    optionOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Option",
  }
);

Quiz.hasMany(Section, {
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
Section.belongsTo(Quiz);

Section.hasMany(Question, {
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
Question.belongsTo(Section);

Question.hasMany(Option, {
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
Option.belongsTo(Question);

Passage.hasMany(Question, {
  onDelete:"SET NULL",
  onUpdate: "RESTRICT"
});
Question.belongsTo(Passage)

module.exports = { Quiz, Section, Question, Option, Passage };
