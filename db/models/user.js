const { DataTypes, Model } = require("sequelize")
const { Quiz, Question, Option, Section } = require("./quizmodel")
const sequelize = require("../connect")
const { Orientation, OrientationInvite } = require("./orientation")

const {
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
} = require("./interview")

const {
	ApplicationRound,
	Course,
	ApplicationRoundCourseJunction,
	Application,
} = require("./application")

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
}
