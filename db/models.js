const { DataTypes, Model } = require("sequelize")
const sequelize = require("./connect")
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
	reasons_to_join,
} = require("./data_lists")
const { sendApplicationReceiptEmail } = require("../functions/sendEmail")
const { autoAssignQuiz } = require("./utils")
const { queueMail } = require("../bull")

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
)

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
			allowNull: true,
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
			allowNull: true,
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
			allowNull: true,
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
			allowNull: true,
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
			allowNull: true,
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
			allowNull: true,
			defaultValue: "N/A",
			validate: {
				notEmpty: {
					msg: "Current Address cannot be empty.",
				},
			},
		},
		belongs_to_flood_area: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		is_tcf_alumni: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		city_of_origin: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		flood_area_name: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		has_completed_ba: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		has_completed_diploma: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		inst_degree_dip: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		education_completed: {
			//this will be used for the new education field
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "N/A",
			validate: {
				notEmpty: {
					msg: "Education Completed cannot be empty. Please select an option.",
				},
			},
		},
		education_completed_major: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "N/A",
		},
		education_ongoing: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "N/A",
		},
		education_ongoing_major: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "N/A",
		},
		year_of_graduation: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
		can_share_fa_docs: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		degree_choice: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "N/A",
		},
		monthly_family_income: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
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
			//this field will be used for the new "employment" field
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "N/A",
		},
		salary: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
			validate: {
				isIn: {
					args: [income_brackets],
					msg: "Invalid salary. Please pick one of the provided options.",
				},
			},
		},
		current_field: {
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
			allowNull: true,
			defaultValue: "N/A",
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
			},
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
				},
			},
		},
		people_earning_in_household: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "0",
			validate: {
				isIn: {
					args: [people_in_household],
					msg: "Invalid number of people earning in household. Please pick one of the provided options.",
				},
			},
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
			allowNull: true,
		},
		preference_reason: {
			type: DataTypes.TEXT,
			defaultValue: "",
			allowNull: true,
		},
		is_comp_sci_grad: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		digi_skills_certifications: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: "",
		},
		how_heard_about_iec: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
		},
		knows_from_IEC: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
		},
		LEC_acknowledgement: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		will_work_full_time: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true,
		},
		acknowledge_online: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		firstPreferenceReason: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: "",
		},
		secondPreferenceReason: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: "",
		},
		thirdPreferenceReason: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: "",
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
		hooks: {
			// beforeValidate: (user, options) => {
			// 	let age_group_cutoffs = [
			// 		[19, "Under 20"],
			// 		[24, "20-24"],
			// 		[29, "25-29"],
			// 		[34, "30-34"],
			// 		[40, "35-40"],
			// 		[110, "Above 40"],
			// 	]
			// 	let age_group = ""

			// 	for (let i = 0; i < age_group_cutoffs.length; i++) {
			// 		if (user.age <= age_group_cutoffs[i][0]) {
			// 			age_group = age_group_cutoffs[i][1]
			// 			break
			// 		}
			// 	}
			// 	if (age_group == "") age_group = "Above 30"
			// 	user.age_group = age_group
			// },
			//need to add auto-rejection for this cohort
			beforeSave: async (user, options) => {
				//this time, we are rejecting students with age != 22-35
				// city = other
				// education != Bachelors (Completed ), Diploma (Completed), Postgraduate (Completed)
				// employment == Employed (Full time), Employed (part time)

				//this is the validation part
				let reject = false

				//age cutoff
				if (user.age_group != "22 - 35") {
					reject = true
				}
				
				if (
					user.education_completed !== "Bachelors (Completed)" &&
					user.education_completed !== "Diploma (Completed)" &&
					user.education_completed !== "Postgraduate (Completed)"
				) {
					reject = true
				}

				if (
					user.type_of_employment === "Employed (Full time)" ||
					user.type_of_employment === "Employed (Part time)"
				) {
					reject = true
				}
				//this is the sending email part
				if (reject === true) {
					try {
						const student = await user.getStudent({
							attributes: ["email", "firstName"],
						})
						user.rejection_email_sent = true
						return queueMail(
							student.email,
							`IEC Application Update`,
							{
								heading: `Application Not Accepted`,
								button_announcer: false,
								inner_text: `Dear ${student.firstName},
							Thank you for showing your interest in the “Tech Apprenticeship Program Cohort 9” at the Institute of Emerging Careers. We appreciate you taking out time to apply for the program. 

							We regret to inform you that we will not be moving forward with your application. 
							
							To be considered for Cohort 9 the required criteria is mentioned below:

							<ul>
							<li>Your age should be more than 22 and less than 35.</li>
							<li>You should be residing in Lahore, Islamabad, Rawalpindi, Karachi, Peshawar or Quetta (We would be launching in other cities from next Cohort).</li>
							<li>You should be a graduate with at least 14 years of completed education and currently are not studying or enrolled in any educational institution.</li>
							<li>You are currently not employed full-time/part-time and not in any kind of internship.</li>
							</ul>
							
							We are thankful to you for applying. All of us at IEC are hopeful to see you in the next cycle of the program and help you build your digital career. Stay tuned to our website and social media for the upcoming programs. 

							We wish you all the best in your future career endeavors.
							

							Best Regards,
							Team Acquisition
							Institute of Emerging Careers
							https://iec.org.pk`,
							},
							false,
							2 * 60 * 60
						) // 2h delay
					} catch (err) {
						user.rejection_email_sent = false
						return new Promise((resolve, reject) => {
							reject(err)
						})
					}
				} else {
					user.rejection_email_sent = false
					return new Promise((resolve) => {
						resolve()
					})
				}
			},

			afterSave: async (user, options) => {
				if (!user.rejection_email_sent) {
					try {
						await sendApplicationReceiptEmail(user)
						return autoAssignQuiz(user, sequelize.models.Assignment)
					} catch (err) {
						console.log("Error in Application post-save hook", err)
					}
				} else {
					return new Promise((resolve) => {
						resolve()
					})
				}
			},
		},
	}
)

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
)

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
)

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
		},
	},
	{
		sequelize,
		modelName: "InterviewRound",
	}
)

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
)

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
)

// InterviewerInvite is junction model for the many-to-many relationship between "Interviewer" and "InterviewRound"
class InterviewerInvite extends Model {
	deleteSlots() {
		return InterviewerSlot.destroy({ where: { InterviewerInviteId: this.id } })
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
)

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
)

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
			allowNull: true,
			defaultValue: null,
		},
	},
	{ sequelize, modelName: "InterviewMatching" }
)

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
)

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
)

class InterviewScores extends Model {}

InterviewScores.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
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
)

class InterviewBookingSlots extends Model {}

InterviewBookingSlots.init(
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
			defaultValue: false,
		},
	},
	{
		sequelize,
		modelName: "InterviewBookingSlots",
	}
)

class Orientation extends Model {}

Orientation.init(
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		time: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		meeting_link: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Orientation",
	}
)

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
				if (user.email_sent == null) user.email_sent = false
			},
		},
	}
)

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
		},
		// Time limit is of sections, not of the quiz itself
	},
	{
		sequelize,
		modelName: "Quiz",
	}
)

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
)

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
)

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
)

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
)

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
)

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
		gender: {
			type: DataTypes.STRING(15),
			allowNull: true,
			validate: {
				len: {
					args: [[2, 15]],
					msg: "Gender name must be between 2 and 15 characters long.",
				},
			},
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
	}
)

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
)

class Assignment extends Model {}

Assignment.init(
	{
		timeOfLastReminderEmail: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0,
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		sequelize,
		modelName: "Assignment",
	}
)

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
)

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
)

class Answer extends Model {}

Answer.init({}, { sequelize, modelName: "Answer" })

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
)

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
)

// LEC Agreements
class LECRound extends Model {}
LECRound.init(
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
		send_reminders: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{ sequelize, modelName: "LECRound" }
)

class LECRoundInvite extends Model {}
LECRoundInvite.init(
	{
		// how many times this particular user has been emailed about this particular LEC round, be it through automated reminder emails or manual emails
		num_emails_sent: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{ sequelize, modelName: "LECRoundInvite" }
)

// an LEC Agreement Template is an unsigned LEC agreement PDF that can be sent to students. Students download it, fill & sign it, and send it back to us.
class LECAgreementTemplate extends Model {}
LECAgreementTemplate.init(
	{
		url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ sequelize }
)

class LECAgreementSubmission extends Model {}
LECAgreementSubmission.init({}, { sequelize })

// Relationships
Quiz.hasMany(Section, {
	onDelete: "CASCADE",
	onUpdate: "RESTRICT",
})
Section.belongsTo(Quiz)

Section.hasMany(Question, {
	onDelete: "CASCADE",
	onUpdate: "RESTRICT",
})
Question.belongsTo(Section)

Question.hasMany(Option, {
	onDelete: "CASCADE",
	onUpdate: "RESTRICT",
})
Option.belongsTo(Question)

Passage.hasMany(Question, {
	onDelete: "SET NULL",
	onUpdate: "RESTRICT",
})
Question.belongsTo(Passage)

// Quiz, Student, and Invite relationships
Quiz.hasMany(Invite, {
	onDelete: "RESTRICT",
	onUpdate: "CASCADE",
	foreignKey: {
		allowNull: false,
	},
})
Invite.belongsTo(Quiz)

Student.belongsTo(Invite, {
	onDelete: "SET NULL",
	onUpdate: "CASCADE",
})
Invite.hasMany(Student)

// Student, Assignment, and Quiz relationships
Student.hasMany(Assignment, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: {
		allowNull: false,
	},
})
Assignment.belongsTo(Student)

Quiz.hasMany(Assignment, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: {
		allowNull: false,
	},
})
Assignment.belongsTo(Quiz)

Application.hasMany(Assignment, {
	onDelete: "RESTRICT",
	onUpate: "CASCADE",
	foreignKey: {
		allowNull: true,
	},
})
Assignment.belongsTo(Application, {
	foreignKey: {
		allowNull: true,
	},
})

// Student, Question, Option and Answer relationship
Question.hasMany(Answer, {
	onDelete: "RESTRICT",
	onUpdate: "RESTRICT",
	foreignKey: {
		allowNull: false,
	},
})
Answer.belongsTo(Question)

Student.hasMany(Answer, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: {
		allowNull: false,
	},
})
Answer.belongsTo(Student)

Option.hasMany(Answer, {
	onDelete: "RESTRICT",
	onUpdate: "CASCADE",
	foreignKey: {
		allowNull: false,
	},
})
Answer.belongsTo(Option)

// Assignment and Attempt relationship
Assignment.hasMany(Attempt, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
	foreignKey: {
		allowNull: false,
	},
})

Attempt.belongsTo(Assignment, { foreignKey: { allowNull: false } })

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
Attempt.hasOne(Score, {
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
})
Score.belongsTo(Attempt)

Student.hasMany(PasswordResetLink)
PasswordResetLink.belongsTo(Student)

Quiz.hasOne(Orientation, {
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
})
Orientation.belongsTo(Quiz)

Orientation.belongsToMany(Student, { through: OrientationInvite })
Student.belongsToMany(Orientation, { through: OrientationInvite })

Application.hasMany(OrientationInvite)
OrientationInvite.belongsTo(Application, {
	foreignKey: { allowNull: true },
})

Quiz.hasOne(InterviewRound, {
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
})
InterviewRound.belongsTo(Quiz)

Interviewer.belongsToMany(InterviewRound, {
	through: InterviewerInvite,
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
})
InterviewRound.belongsToMany(Interviewer, { through: InterviewerInvite })

Student.belongsToMany(InterviewRound, {
	through: StudentInterviewRoundInvite,
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
})
InterviewRound.belongsToMany(Student, { through: StudentInterviewRoundInvite })

InterviewerInvite.hasMany(InterviewerSlot)
InterviewerSlot.belongsTo(InterviewerInvite)

InterviewRound.hasMany(InterviewMatching)
Interviewer.hasMany(InterviewMatching)
Student.hasMany(InterviewMatching)

InterviewRound.hasMany(InterviewQuestions)
InterviewRound.hasMany(InterviewAnswers)
Interviewer.hasMany(InterviewAnswers)
Student.hasMany(InterviewAnswers)
InterviewQuestions.hasMany(InterviewAnswers)

Student.hasMany(InterviewBookingSlots)
Interviewer.hasMany(InterviewBookingSlots)
InterviewerSlot.hasMany(InterviewBookingSlots)
InterviewRound.hasMany(InterviewBookingSlots)

InterviewRound.hasMany(InterviewScores)
Student.hasMany(InterviewScores)
Interviewer.hasMany(InterviewScores)

ApplicationRound.belongsToMany(Course, {
	through: ApplicationRoundCourseJunction,
	unique: false,
	uniqueKey: "ApplicationRoundCourseJunctionKey1",
})
Course.belongsToMany(ApplicationRound, {
	through: ApplicationRoundCourseJunction,
	unique: false,
	uniqueKey: "ApplicationRoundCourseJunctionKey2",
})

Application.belongsTo(Course, { as: "first preference", allowNull: false })
Application.belongsTo(Course, { as: "second preference", allowNull: false })
Application.belongsTo(Course, { as: "third preference", allowNull: false })

Student.hasMany(Application)
Application.belongsTo(Student, {
	allowNull: false,
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
})

ApplicationRound.hasMany(Application)
Application.belongsTo(ApplicationRound, {
	allowNull: false,
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
})

Quiz.hasMany(ApplicationRound, {
	foreignKey: "auto_assigned_quiz_id",
})
ApplicationRound.belongsTo(Quiz)

LECRound.belongsToMany(Student, { through: LECRoundInvite, allowNull: false })
Student.belongsToMany(LECRound, { through: LECRoundInvite, allowNull: false })

Quiz.hasOne(LECRound, {
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
})
LECRound.belongsTo(Quiz)

LECRound.hasMany(LECAgreementTemplate)
LECAgreementTemplate.belongsTo(LECRound, { allowNull: false })

LECRound.hasMany(LECAgreementSubmission)
LECAgreementSubmission.belongsTo(LECRound, { allowNull: false })

Student.hasMany(LECAgreementSubmission)
LECAgreementSubmission.belongsTo(Student, { allowNull: false })

LECAgreementTemplate.hasMany(LECAgreementSubmission)
LECAgreementSubmission.belongsTo(LECAgreementTemplate, { allowNull: false })

module.exports = {
	Application,
	ApplicationRound,
	Course,
	ApplicationRoundCourseJunction,
	InterviewRound,
	Interviewer,
	InterviewerInvite,
	InterviewerSlot,
	StudentInterviewRoundInvite,
	InterviewMatching,
	InterviewQuestions,
	InterviewAnswers,
	InterviewScores,
	InterviewBookingSlots,
	Orientation,
	OrientationInvite,
	LECRound,
	LECRoundInvite,
	LECAgreementTemplate,
	LECAgreementSubmission,
	Quiz,
	Section,
	Question,
	Option,
	Passage,
	User,
	Student,
	Invite,
	Assignment,
	Answer,
	Attempt,
	Score,
	PasswordResetLink,
	Email,
}
