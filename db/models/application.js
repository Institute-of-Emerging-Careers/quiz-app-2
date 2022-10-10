const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connect");
const {
	cities,
	provinces,
	countries,
	education_levels,
	degree_choice,
	type_of_employment,
	income_brackets,
	people_in_household,
	age_groups,
	knows_from_IEC,
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
		open: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
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
		belongs_to_flood_area: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please tell us if you are from a flood affected area or not.",
				},
			},
		},
		city_of_origin: {
			type: DataTypes.STRING(100),
			allowNull: true,
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
		flood_area_name: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		has_completed_ba: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please tell us if you have completed a Bachelor's",
				},
			},
		},
		has_completed_diploma: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please tell us if you have completed a Diploma",
				},
			},
		},
		inst_degree_dip: {
			type: DataTypes.STRING,
			allowNull: true,
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
		can_share_fa_docs:{
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		education_ongoing: {
			type: DataTypes.STRING,
			allowNull: true,
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
			allowNull: true,
			defaultValue: "N/A",
			validate: {
				notEmpty: {
					msg: "Major/Field of Ongoing Education cannot be empty.",
				},
			},
		},
		degree_choice: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "N/A",
			validate: {
				notEmpty: {
					msg: "Degree Choice cannot be empty. Please select an option.",
				},
				isIn: {
					args: [degree_choice],
					msg: "Invalid Degree Choice",
				},
			},
		},
		monthly_family_income: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "0",
			validate: {
				notEmpty: {
					msg: "Monthly Family Income cannot be empty. Please enter a non-negative value.",
				},
				isIn: {
					args: [income_brackets],
					msg: "Invalid Monthly Family Income",
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
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
			validate: {
				isIn:{
					args: [income_brackets],
					msg: "Invalid salary. Please pick one of the provided options.",
				},
			},
		},
		current_field : {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "N/A",
		},
		will_leave_job: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		how_to_enroll: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "N/A",
			validate: {
				notEmpty: {
					msg: "How to enroll cannot be empty. Please select an option.",
				}
			}
		},
		salary_expectation: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
			validate: {
				isIn: {
					args: [income_brackets],
					msg: "Invalid salary expectation. Please pick one of the provided options.",
				},
				notEmpty: {
					msg: "Salary Expectation cannot be empty. Please enter a non-negative value.",
				},
			}
		},
		on_fa_in_university: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		people_in_household: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
			validate: {
				isIn: {
					args: [people_in_household],
					msg: "Invalid number of people in household. Please pick one of the provided options.",
				}
			}
		},
		people_earning_in_household: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
			validate: {
				isIn: {
					args: [people_in_household],
					msg: "Invalid number of people earning in household. Please pick one of the provided options.",
				}
			}
		},
		is_married: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		how_complete_course: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "N/A",
		},
		can_pay_2000: {
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
			allowNull: false,
			validate: {
				isIn: {
					args: [sources_of_information],
					msg: "Please tell us how you heard about IEC.",
				},
			},
		},
		knows_from_IEC: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isIn: {
					args: [knows_from_IEC],
					msg: "Please tell us if you know anyone from IEC."
				},
			},
		},
		LEC_acknowledgement: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please tell us if you have read and understood the LEC.",
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
		assessment_email_sent: {
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
					[19, "Under 20"],
					[24, "20-24"],
					[29, "25-29"],
					[34, "30-34"],
					[40, "35-40"],
					[110, "Above 40"],
				];
				let age_group = "";

				for (let i = 0; i < age_group_cutoffs.length; i++) {
					if (user.age <= age_group_cutoffs[i][0]) {
						age_group = age_group_cutoffs[i][1];
						break;
					}
				}
				if (age_group == "") age_group = "Above 30";
				user.age_group = age_group;
			},
			beforeSave: async (user, options) => {
				let reject = false;
				if (user.age < 18 || user.age > 30 || user.time_commitment == false) {
					reject = true;
				}

				if (reject === true) {
					try {
						const student = await user.getStudent({
							attributes: ["email", "firstName"],
						});
						user.rejection_email_sent = true;
						return queueMail(student.email, `IEC Application Update`, {
							heading: `Application Not Accepted`,
							inner_text: `Dear ${student.firstName}, 
 
              Thank you for showing your interest in the Digital Skills Training Program at the Institute of Emerging Careers (IEC).  
               
              We regret to inform you that we will not be moving forward with your application because you do not meet the eligibility criteria required for the program. The Digital Skills Training Program is designed to train those who:<br>
              <ul>
              <li>Are in the age bracket 18-30</li>
              <li>Can commit 30-40 hours per week</li>
              </ul>
                
              Stay tuned to our website and social media for the upcoming programs which might suit you or refer a friend for the Digital Skills Training Program, who fall under this criteria.   
               
              We wish you all the best for your future career endeavors. For any further questions or concerns, feel free to contact us at <a href="mailto:shan.rajput@iec.org.pk">shan.rajput@iec.org.pk</a> on Whatsapp: 03338800947 
               
              Best Regards, 
              Director Admissions 
              Institute of Emerging Careers 
              http://www.iec.org.pk`,
							button_announcer: "Visit out website to learn more about us",
							button_text: "Visit",
							button_link: "https://iec.org.pk",
						});
					} catch (err) {
						console.log(err);
						user.rejection_email_sent = false;
						return new Promise((resolve, reject) => {
							reject(err);
						});
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
            
			We have received your application for the IEC Tech Apprenticeship Program by Institute of Emerging Careers (IEC). Your application is being processed. Please note the following steps during the acquisition process for which we will need your cooperation and patience. You will receive the email for an Online Assessment soon. Please stay tuned! 

            Next steps for Acquisition:
            <ul>
            <li>Online Assessment (22nd and 23rd October)</li>
            <li>Orientation (27th October)</li>
            <li>Interviews (Date to be Announced)</li>
            <li>Zero Week</li>
            </ul>

            The process is long but we assure you that if you give your best, you can get through it and will be rewarded for all the effort you put in!

            
            Are you excited to start this journey with us? Stay tuned as our team gets back to you with an update within the next week or soon. For any further questions or concerns, feel free to contact us at <a href="mailto:namra.khan@iec.org.pk">namra.khan@iec.org.pk</a> or Whatsapp: 03338800947.
             
            Best Regards, 
            Director Admissions 
            Institute of Emerging Careers 
            http://www.iec.org.pk 
            <a href="https://www.facebook.com/instituteofemergingcareers?_rdc=1&_rdr">Facebook</a> | Instagram | <a href="https://www.linkedin.com/company/emergingcareers/">LinkedIn</a> | <a href="https://twitter.com/iec_pk?lang=en">Twitter</a>`
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
