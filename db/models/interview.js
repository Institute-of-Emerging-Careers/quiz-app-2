const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");

class InterviewRound extends Model {}

InterviewRound.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    num_zoom_accounts: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 3,
    },
    interview_duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
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

class InterviewerSlot extends Model {}

InterviewerSlot.init(
  {
    start: {
      type: DataTypes.STRING(16), //ISO Format without seconds and milliseconds is 16 digits long
      allowNull: false,
    },
    end: {
      type: DataTypes.STRING(16), //ISO Format without seconds and milliseconds is 16 digits long
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InterviewerSlot",
  }
);

// InterviewerInvite is junction model for the many-to-many relationship between "Interviewer" and "InterviewRound"
class InterviewerInvite extends Model {
  deleteSlots() {
    return InterviewerSlot.destroy({ where: { InterviewerInviteId: this.id } });
  }
}
InterviewerInvite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  { sequelize, modelName: "InterviewerInvite" }
);

// StudentInterviewRoundInvite is junction model for the many-to-many relationship between "Student" and "InterviewRound"
class StudentInterviewRoundInvite extends Model {}
StudentInterviewRoundInvite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  { sequelize, modelName: "StudentInterviewRoundInvite" }
);

class InterviewMatching extends Model {}

InterviewMatching.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    interviewer_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //if the student did not show up for the interview and needs resceduling
    student_absent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  { sequelize, modelName: "InterviewMatching" }
);

class InterviewerCalendlyLinks extends Model {}

InterviewerCalendlyLinks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    calendly_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "InterviewerCalendlyLinks" }
);

class InterviewQuestions extends Model {}

InterviewQuestions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    InterviewRoundId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionScale: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "InterviewQuestions" }
);

class InterviewAnswers extends Model {}

InterviewAnswers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    InterviewRoundId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uniqueCompositeIndex",
    },
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uniqueCompositeIndex",
    },
    InterviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uniqueCompositeIndex",
    },
    InterviewQuestionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uniqueCompositeIndex",
    },
    questionAnswer: {
      //if descriptive then this is the answer
      type: DataTypes.STRING,
      allowNull: true,
    },
    questionRating: {
      //if number scale, this is the rating
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { sequelize, modelName: "InterviewAnswers" }
);

class InterviewScores extends Model {}

InterviewScores.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    InterviewRoundId: {
      type: DataTypes.INTEGER,
      unique: "uniqueScoreIndex",
    },
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uniqueScoreIndex",
    },
    InterviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "uniqueScoreIndex",
    },
    obtainedScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "InterviewScores" }
);

class InterviewBookingSlots extends Model {};

InterviewBookingSlots.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  InterviewRoundId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  StudentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  InterviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  InterviewerSlotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING(16), //ISO Format without seconds and milliseconds is 16 digits long
    allowNull: true,
  },
  endTime: {
    type: DataTypes.STRING(16), //ISO Format without seconds and milliseconds is 16 digits long
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  booked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize, modelName: "InterviewBookingSlots" 
})
module.exports = {
  InterviewRound,
  Interviewer,
  InterviewerInvite,
  InterviewerSlot,
  StudentInterviewRoundInvite,
  InterviewMatching,
  InterviewerCalendlyLinks,
  InterviewQuestions,
  InterviewAnswers,
  InterviewScores,
  InterviewBookingSlots
};

//all associations are in the user.js and quizmodel.js files because different ordering of loading of these files causes bugs
// see https://stackoverflow.com/questions/50615835/hasmany-called-with-something-thats-not-a-subclass-of-sequelize-model
