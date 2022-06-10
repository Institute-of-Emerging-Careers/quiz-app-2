const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");
const {
  cities,
  provinces,
  countries,
  education_levels,
  type_of_employment,
  age_groups,
  sources_of_information,
} = require("../../db/data_lists");
const { queueMail } = require("../../bull");

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
        isIn: {
          args: [age_groups],
          msg: "Invalid age group.",
        },
      },
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: {
          args: [cities],
          msg: "Invalid city. Please select one from the provided list.",
        },
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
        notEmpty: {
          msg: "Education Completed cannot be empty. Please select an option.",
        },
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
        notEmpty: {
          msg: "Ongoing Education cannot be empty. Please select an option.",
        },
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
        notEmpty: {
          msg: "Monthly Family Income cannot be empty. Please enter a non-negative value.",
        },
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
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please tell us if you have applied to IEC before by selecting one of the options.",
        },
      },
    },
    preference_reason: {
      type: DataTypes.TEXT,
      defaultValue: "",
      allowNull: false,
    },
    is_comp_sci_grad: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please tell us if you are a computer science graduate or not.",
        },
      },
    },
    digi_skills_certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    how_heard_about_iec: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [sources_of_information],
          msg: "Please tell us how you heard about IEC.",
        },
      },
    },
    will_work_full_time: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        notEmpty: {
          msg: "Please tell us if you will work full time, if granted a job opportunity, or not.",
        },
      },
    },
    acknowledge_online: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please acknowledge that the program is online.",
        },
      },
    },
    rejection_email_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Application",
    validate: {
      firstPreferenceId() {
        if (
          this.firstPreferenceId == null ||
          this.firstPreferenceId == undefined
        ) {
          throw Error("First Preference cannot be empty. Select an option.");
        }
      },
      secondPreferenceId() {
        if (
          this.secondPreferenceId == null ||
          this.secondPreferenceId == undefined
        ) {
          throw Error("Second Preference cannot be empty. Select an option.");
        }
      },
      thirdPreferenceId() {
        if (
          this.thirdPreferenceId == null ||
          this.thirdPreferenceId == undefined
        ) {
          throw Error("Third Preference cannot be empty. Select an option.");
        }
      },
    },
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

        for (let i = 0; i < age_group_cutoffs.length; i++) {
          if (user.age < age_group_cutoffs[i][0]) {
            age_group = age_group_cutoffs[i][1];
            break;
          }
        }
        if (age_group == "") age_group = "Above 30";
        user.age_group = age_group;
      },
      beforeSave: async (user, options) => {
        let reject = false;
        if (user.age < 18 || user.age > 30) {
          reject = "Age of applicant must be between 18 and 30 years.";
        } else if (user.time_commitment == false) {
          reject =
            "Applicant must commit 30-40 hours of time per week to the program.";
        } else if (user.will_work_full_time == false) {
          reject =
            "Applicant must be willing to work on a full time job after graduating from the program.";
        }

        if (reject !== false) {
          try {
            const student = await user.getStudent({ attributes: ["email"] });
            user.rejection_email_sent = true;
            return queueMail(student.email, `IEC Application Update`, {
              heading: `Application Not Accepted`,
              inner_text: `Dear Student
                <br><br>
                This email is to inform you that we are unable to accept your application at the moment for the following reason:
                <br>
                <b>Reason:</b> ${reject}
                Thank you for showing your interest in becoming part of the program. 
                <br>
                Sincerely, 
                IEC Admissions Team`,
              button_announcer: "Visit out website to learn more about us",
              button_text: "Visit",
              button_link: "https://iec.org.pk",
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          user.rejection_email_sent = false;
          return new Promise((resolve) => {
            resolve();
          });
        }
      },

      afterSave: async (user, options) => {
        if (!user.rejection_email_sent) {
          // send application saved confirmation email
          const student = await user.getStudent({
            attributes: ["email", "firstName", "cnic"],
          });
          return queueMail(student.email, `IEC Application Receipt`, {
            heading: `Application Received`,
            inner_text: `Dear ${student.firstName}
            
            We have received your application for the Digital Skills Training Program by Institute of Emerging Careers (IEC).  Your application (CNIC ${student.cnic}) is being processed. Please note the following steps during the acquisition process for which we will need your cooperation and patience. You will receive the email for an Online Assessment in a week. Please stay tuned! 

            Acquisition Process? 
            Online Registration
            Online Assessment 
            Online Orientation
            One-on-One Interviews
            Zero Week
            Probation Week 
            Course Begins
            
            We know this is a long process but we assure you that if you give your best, you can easily get through it. You will get rewarded for all the effort you put in!
            
             Are you excited to start this journey with us? Stay tuned as our team gets back to you with an update within the next week or soon. For any further questions or concerns, feel free to contact us at <a href="mailto:shan.rajput@iec.org.pk">shan.rajput@iec.org.pk</a> or Whatsapp: 03338800947.
             
            Best Regards, 
            Director Admissions 
            Institute of Emerging Careers 
            http://www.iec.org.pk 
            Facebook | Instagram | LinkedIn | Twitter`,
            button_announcer: "You can log into your student panel here:",
            button_text: "Student Panel",
            button_link: `${process.env.SITE_DOMAIN_NAME}/student/login`,
          });
        } else {
          return new Promise((resolve) => {
            resolve();
          });
        }
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
