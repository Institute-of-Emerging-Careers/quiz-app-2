const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");
const {
  cities,
  provinces,
  countries,
  education_levels,
  type_of_employment,
} = require("../../resources/js/data_lists");

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

class Application extends Model {}

Application.init(
  {
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
    computer_and_internet_access: {
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
    acknowledge_online: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Application",
    hooks: {
      beforeValidate: (user, options) => {
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
  Application,
  ApplicationRound,
  Course,
  ApplicationRoundCourseJunction,
};
