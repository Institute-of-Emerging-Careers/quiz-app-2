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
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty."
        },
        len: {
          args:[[1,100]],
          msg: "firstName cannot be shorter than 1 alphabet or longer than 100 alphabets."
        },
      }
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty."
        },
        len: {
          args:[[1,100]],
          msg: "lastName cannot be shorter than 1 alphabet or longer than 100 alphabets."
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Email cannot be empty."
        },
        len: {args: [[5,254]], msg: "Email cannot be shorter than 5 characters or longer than 254 characters."},
        isEmail: {
          msg: "Invalid email address format."
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty."
        },
        len: {args: [[6,255]], msg: "Password cannot be shorter than 6 characters or longer than 255 characters."},
      }
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Phone number cannot be empty."
        },
        len: {
          msg: "Phone number must be exactly 11 digits long. For example, 03451234567. Do not use dashes or spaces."
        },
        is:{args: [/\d\d\d\d\d\d\d\d\d\d\d/i], msg: "Phone number invalid. Please make sure it has no alphabets, symbols, dashes, or spaces."},
      },
    },
    cnic: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique:true,
      validate: {
        is:{args:[/\d\d\d\d\d-\d\d\d\d\d\d\d-\d/i], msg: "CNIC Format Invalid. Correct format: xxxxx-xxxxxxx-x"},
        notEmpty: {
          msg: "CNIC cannot be empty."
        },
        len: {
          args:[15],
          msg: "CNIC must be exactly 15 characters long (13 digits and 2 dashes)."
        },
      }
    },
    age: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Age cannot be empty."
        },
        min: {
          args: [5],
          msg: "Age must be between 5 and 110"
        },
        max:{
          args: [110],
          msg: "Age must be between 5 and 110"
        },
      }
    },
    gender: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Gender cannot be empty."
        },
        len: {args: [[2,15]], msg: "Gender name must be between 2 and 15 characters long."},
      }
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "City cannot be empty."
        },
        len: {args: [[2,100]], msg: "City name must be between 2 and 100 characters long."},
      }
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address cannot be empty."
        },
        len: {args: [[10,300]], msg: "Address cannot be shorter than 10 characters and longer than 300 characters."},
      }
    },
    hasUnsubscribedFromEmails: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
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
    timeOfLastReminderEmail: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
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
      type: DataTypes.BIGINT,
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

class PasswordResetLink extends Model {}

PasswordResetLink.init({
  key: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
},{
  sequelize,
  modelName: "PasswordResetLink",
})


// Quiz, Student, and Invite relationships
Quiz.hasMany(Invite, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  }
});
Invite.belongsTo(Quiz);

Student.belongsTo(Invite, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false
  }
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
})

Attempt.belongsTo(Assignment)

// Attempt and Section relationship
Section.hasMany(Attempt, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
})
Attempt.belongsTo(Section)

// Attempt and Score relationship
Attempt.hasOne(Score)
Score.belongsTo(Attempt)

Student.hasMany(PasswordResetLink)
PasswordResetLink.belongsTo(Student)


module.exports = { User, Student, Invite, Assignment, Answer, Attempt, Score, PasswordResetLink };
