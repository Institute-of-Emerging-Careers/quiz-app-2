const sequelize = require("../connect")

const {
	Quiz,
	Invite,
	Student,
	Assignment,
	Application,
	Section,
	Question,
	Option,
	Answer,
	Attempt,
	User,
	Score,
	PasswordResetLink,
	Orientation,
	InterviewRound,
	OrientationInvite,
	InterviewerSlot,
	Interviewer,
	Course,
	InterviewScores,
	InterviewBookingSlots,
	InterviewAnswers,
	InterviewerInvite,
	StudentInterviewRoundInvite,
	InterviewMatching,
	InterviewQuestions,
	ApplicationRound,
	ApplicationRoundCourseJunction,
} = sequelize.models

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
