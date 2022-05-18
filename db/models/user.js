const { Sequelize, DataTypes, Model } = require("sequelize");
const { Quiz, Question, Option, Section } = require("./quizmodel");
const sequelize = require("../connect");
const {
  cities,
  provinces,
  countries,
  education_levels,
  type_of_employment,
} = require("../../resources/js/data_lists");
const { Orientation, OrientationInvite } = require("./orientation");

const {
  InterviewRound,
  Interviewer,
  InterviewerInvite,
  InterviewerSlot,
  StudentInterviewRoundInvite,
} = require("./interview");

const {
  ApplicationRound,
  Course,
  ApplicationRoundCourseJunction,
} = require("./application");

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
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty.",
        },
        len: {
          args: [[1, 100]],
          msg: "firstName cannot be shorter than 1 alphabet or longer than 100 alphabets.",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty.",
        },
        len: {
          args: [[1, 100]],
          msg: "lastName cannot be shorter than 1 alphabet or longer than 100 alphabets.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Email cannot be empty.",
        },
        len: {
          args: [[5, 254]],
          msg: "Email cannot be shorter than 5 characters or longer than 254 characters.",
        },
        isEmail: {
          msg: "Invalid email address format.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty.",
        },
        len: {
          args: [[6, 255]],
          msg: "Password cannot be shorter than 6 characters or longer than 255 characters.",
        },
      },
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Phone number cannot be empty.",
        },
        len: {
          msg: "Phone number must be exactly 11 digits long. For example, 03451234567. Do not use dashes or spaces.",
        },
        is: {
          args: [/\d\d\d\d\d\d\d\d\d\d\d/i],
          msg: "Phone number invalid. Please make sure it has no alphabets, symbols, dashes, or spaces.",
        },
      },
    },
    cnic: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: [/\d\d\d\d\d-\d\d\d\d\d\d\d-\d/i],
          msg: "CNIC Format Invalid. Correct format: xxxxx-xxxxxxx-x",
        },
        notEmpty: {
          msg: "CNIC cannot be empty.",
        },
        len: {
          args: [15],
          msg: "CNIC must be exactly 15 characters long (13 digits and 2 dashes).",
        },
      },
    },
    age: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Age cannot be empty.",
        },
        min: {
          args: [5],
          msg: "Age must be between 5 and 110",
        },
        max: {
          args: [110],
          msg: "Age must be between 5 and 110",
        },
      },
    },
    age_group: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Under 18", "18-21", "22-24", "25-26", "27-30", "Above 30"]],
      },
    },
    gender: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Gender cannot be empty.",
        },
        len: {
          args: [[2, 15]],
          msg: "Gender name must be between 2 and 15 characters long.",
        },
      },
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "City cannot be empty.",
        },
        len: {
          args: [[2, 100]],
          msg: "City name must be between 2 and 100 characters long.",
        },
      },
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address cannot be empty.",
        },
        len: {
          args: [[10, 300]],
          msg: "Address cannot be shorter than 10 characters and longer than 300 characters.",
        },
      },
    },
    father_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        notEmpty: {
          msg: "Father's Name cannot be empty.",
        },
        len: {
          args: [[1, 200]],
          msg: "Father's Name cannot be shorter than 1 alphabet or longer than 200 alphabets.",
        },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        isIn: {
          args: [cities],
          msg: "Invalid city. Please select one from the provided list, or pick 'Other'.",
        },
      },
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        isIn: {
          args: [provinces],
          msg: "Invalid provinces. Please select one from the provided list.",
        },
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        isIn: {
          args: [countries],
          msg: "Invalid country. Please select one from the provided list.",
        },
      },
    },
    home_address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        notEmpty: {
          msg: "Home Address cannot be empty.",
        },
      },
    },
    current_address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        notEmpty: {
          msg: "Current Address cannot be empty.",
        },
      },
    },
    education_completed: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        isIn: {
          args: [education_levels],
          msg: "Invalid Education Completed Level",
        },
      },
    },
    education_completed_major: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        notEmpty: {
          msg: "Major/Field of Completed Education cannot be empty.",
        },
      },
    },
    education_ongoing: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        isIn: {
          args: [education_levels],
          msg: "Invalid Education Ongoing Level",
        },
      },
    },
    education_ongoing_major: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
      validate: {
        notEmpty: {
          msg: "Major/Field of Ongoing Education cannot be empty.",
        },
      },
    },
    monthly_family_income: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: "0",
      validate: {
        min: {
          args: [[0]],
          msg: "Invalid monthly family income. Must be a positive number.",
        },
      },
    },
    computer_access: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    internet_access: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    internet_facility_in_area: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    time_commitment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_employed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    type_of_employment: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "N/A",
      validate: {
        isIn: {
          args: [type_of_employment],
          msg: "Invalid type of employment. Please pick one of the provided options.",
        },
      },
    },
    salary: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: "0",
      validate: {
        min: {
          args: [[0]],
          msg: "Invalid monthly family income. Must be a positive number.",
        },
      },
    },
    will_leave_job: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    has_applied_before: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    preference_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_comp_sci_grad: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    digi_skills_certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    how_heard_about_iec: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hasUnsubscribedFromEmails: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Student",
    indexes: [{ unique: true, fields: ["email"] }],
    hooks: {
      beforeCreate: (user, options) => {
        let age_group_cutoffs = [
          [18, "Under 18"],
          [21, "18-21"],
          [24, "22-24"],
          [26, "25-26"],
          [30, "27-30"],
          [110, "Above 30"],
        ];
        let age_group = "";

        age_group_cutoffs.forEach((cutoff) => {
          if (user.age < cutoff[0]) age_group = cutoff[1];
        });
        if (age_group == "") age_group = "Above 30";
        user.age_group = age_group;
      },
    },
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
    timeOfLastReminderEmail: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
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
      defaultValue: "Not Started",
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
      type: DataTypes.BIGINT,
      allowNull: true,
    },
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
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Score",
  }
);

class Answer extends Model {}

Answer.init({}, { sequelize, modelName: "Answer" });

class PasswordResetLink extends Model {}

PasswordResetLink.init(
  {
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PasswordResetLink",
  }
);

class Email extends Model {}

Email.init(
  {
    subject: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    heading: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    button_pre_text: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    button_label: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    button_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Email",
  }
);

// Quiz, Student, and Invite relationships
Quiz.hasMany(Invite, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
});
Invite.belongsTo(Quiz);

Student.belongsTo(Invite, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Invite.hasMany(Student);

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
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
});
Answer.belongsTo(Option);

// Assignment and Attempt relationship
Assignment.hasMany(Attempt, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
});

Attempt.belongsTo(Assignment);

// Attempt and Section relationship
Section.hasMany(Attempt, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
});
Attempt.belongsTo(Section);

// Attempt and Score relationship
Attempt.hasOne(Score, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Score.belongsTo(Attempt);

Student.hasMany(PasswordResetLink);
PasswordResetLink.belongsTo(Student);

Quiz.hasOne(Orientation, {
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Orientation.belongsTo(Quiz);

Orientation.belongsToMany(Student, { through: OrientationInvite });
Student.belongsToMany(Orientation, { through: OrientationInvite });

Quiz.hasOne(InterviewRound, {
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
InterviewRound.belongsTo(Quiz);

Interviewer.belongsToMany(InterviewRound, {
  through: InterviewerInvite,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
InterviewRound.belongsToMany(Interviewer, { through: InterviewerInvite });

Student.belongsToMany(InterviewRound, {
  through: StudentInterviewRoundInvite,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
InterviewRound.belongsToMany(Student, { through: StudentInterviewRoundInvite });

InterviewerInvite.hasMany(InterviewerSlot);
InterviewerSlot.belongsTo(InterviewerInvite);

ApplicationRound.belongsToMany(Course, {
  through: ApplicationRoundCourseJunction,
});
Course.belongsToMany(ApplicationRound, {
  through: ApplicationRoundCourseJunction,
});

Student.belongsTo(Course, { as: "first preference" });
Student.belongsTo(Course, { as: "second preference" });
Student.belongsTo(Course, { as: "third preference" });
// continue here

module.exports = {
  User,
  Student,
  Invite,
  Assignment,
  Answer,
  Attempt,
  Score,
  PasswordResetLink,
  Email,
};
