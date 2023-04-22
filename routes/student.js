const express = require("express")
const router = express.Router()
const { DateTime } = require("luxon")
const bcrypt = require("bcrypt")
const randomstring = require("randomstring")

// requirements
const checkStudentAuthenticated = require("../db/check-student-authenticated")
const checkStudentAlreadyLoggedIn = require("../db/check-student-already-logged-in")
const {
	Quiz,
	Section,
	Student,
	Invite,
	Assignment,
	Attempt,
	PasswordResetLink,
	Interviewer,
	InterviewRound,
	InterviewMatching,
	InterviewBookingSlots,
	LECAgreementTemplate,
	LECAgreementSubmission,
} = require("../db/models")
const s3 = require("../s3-config")
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { pdf_upload } = require("../multer-config")
const calculateSingleAssessmentStatus = require("../functions/calculateSingleAssessmentStatus")

const { queueMail } = require("../bull")

// starting cron-jobs
const {
	assessment_reminder_mailer_task,
	score_past_deadline_attempts,
} = require("../functions/cron-ping")
const moment = require("moment")

assessment_reminder_mailer_task.start()
score_past_deadline_attempts.start()

// middleware that is specific to this router
router.use((req, res, next) => {
	next()
})

router.get("/orientation", checkStudentAuthenticated, async (req, res) => {
	try {
		const student = await Student.findOne({ where: { id: req.user.user.id } })
		const orientations = await student.getOrientations()

		res.render("student/orientation/index.ejs", {
			user_type: req.user.type,
			query: req.query,
			DateTime: DateTime,
			orientations: orientations,
		})
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

router.get("/interview", checkStudentAuthenticated, (req, res) => {
	res.render("student/interview/index.ejs", {
		user_type: req.user.type,
		query: req.query,
	})
})

router.get("/onboarding", checkStudentAuthenticated, (req, res) => {
	res.render("student/onboarding/index.ejs", {
		user_type: req.user.type,
		query: req.query,
	})
})

router.post("/signup", async (req, res) => {
	const firstName = req.body.firstName,
		lastName = req.body.lastName,
		email = req.body.email,
		phone = req.body.phone,
		cnic = req.body.cnic,
		password = req.body.password,
		age = req.body.age,
		gender = req.body.gender,
		city = req.body.city,
		address = req.body.address,
		invite_link = req.body.invite

	try {
		// to count the number of students who have registered using this particular invite link:
		const invite = await Invite.findOne({
			where: {
				link: invite_link,
			},
		})
		invite.increment("registrations")

		// creating student
		let student = Student.build({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: await bcrypt.hash(password, 10),
			phone: phone,
			cnic: cnic,
			age: age,
			gender: gender,
			city: city,
			address: address,
			InviteId: invite.id,
		})

		// validating student information
		if (await student.validate()) {
			student = await student.save()

			// assign the quiz associated with the invite to this student
			await Assignment.create({
				StudentId: student.id,
				QuizId: invite.QuizId,
			})

			// send automated Welcome email to student
			try {
				await queueMail(email, `Welcome to IEC LCMS`, {
					heading: "Welcome to the IEC LCMS",
					inner_text:
						"We have sent you an assessment to solve. You have 72 hours to solve the assessment.",
					button_announcer: "Click on the button below to solve the Assessment",
					button_text: "Solve Assessment",
					button_link: "https://apply.iec.org.pk/student/login",
				})
			} catch (err) {
				console.log("Welcome email sending failed.")
			}
			res.redirect("/student/login")
		}
	} catch (err) {
		console.log(err)
		if (err.errors) {
			res.redirect(
				"/invite/" +
				invite_link +
				"?error=" +
				encodeURIComponent(err.errors[0].type) +
				"&field=" +
				encodeURIComponent(err.errors[0].path) +
				"&type=" +
				encodeURIComponent(err.errors[0].validatorName) +
				"&message=" +
				encodeURIComponent(err.errors[0].message)
			)
		} else res.redirect("/invite/" + invite_link)
	}
})

router.get("/", checkStudentAuthenticated, async (req, res) => {
	// Invite Links are obsolete now. Assignments are created from assign.js
	// if (req.query.link != undefined) {
	//   const invite = await Invite.findOne({
	//     where: { link: req.query.link },
	//     include: { model: Quiz, attributes: ["id"] },
	//   });
	//   const quizId = invite.Quiz.id;
	//   await Assignment.findOrCreate({
	//     where: { StudentId: req.user.user.id, QuizId: quizId },
	//   });
	// }

	const student = await Student.findOne({ where: { id: req.user.user.id } })
	const orientations = await student.getOrientations()

	// check if an orientation exists that has a date in the future
	const orientation_exists = orientations.reduce(
		(orientation_exists, cur_orientation) => {
			if (orientation_exists) return true

			if (
				DateTime.fromFormat(cur_orientation.date, "MM/dd/yyyy").startOf(
					"day"
				) >= DateTime.now().startOf("day")
			)
				return true
			else return false
		},
		false
	)
	console.log(orientation_exists)

	res.render("student/index.ejs", {
		user_type: req.user.type,
		query: req.query,
		orientation_exists: orientation_exists,
	})
})

router.get("/login", checkStudentAlreadyLoggedIn, async (req, res) => {
	res.render("student/login/index.ejs", {
		link: req.query.link,
		email: req.query.email,
		cnic: req.query.cnic,
		success: req.query.success,
		redirect: req.query.url,
	})
})

// render the forgot password page
router.get(
	"/forgot-password",
	checkStudentAlreadyLoggedIn,
	async (req, res) => {
		res.render("student/login/forgot_password.ejs", {
			link: req.query.link,
			error: req.query.error,
		})
	}
)

// set a new password
router.post("/change-password", async (req, res) => {
	if (req.body.password1 == req.body.password2) {
		try {
			const password = req.body.password1
			const password_reset_link = await PasswordResetLink.findOne({
				where: {
					key: req.body.key,
					StudentId: req.body.id,
				},
				include: [Student],
			})

			if (password_reset_link != null) {
				await password_reset_link.Student.update({
					password: await bcrypt.hash(password, 10),
				})
				console.log("password updated for ", password_reset_link.Student.email)

				await password_reset_link.destroy()

				res.redirect("/student/login?success=password-reset")
			} else {
				res.render("templates/error.ejs", {
					additional_info: "Invalid Link",
					error_message:
						"The password reset link is invalid. Please go to the Student Login Page and click on Forgot Password to generate a valid link.",
					action_link: "/student/login",
					action_link_text: "Student Login Page",
				})
			}
		} catch (err) {
			console.log(err)
			res.sendStatus(500)
		}
	} else {
		res.render("student/login/set_new_password.ejs", {
			key: req.body.key,
			student_id: req.body.id,
			error: "Passwords do not match",
		})
	}
})

// send password reset link in email
router.post(
	"/reset-password",
	checkStudentAlreadyLoggedIn,
	async (req, res) => {
		console.log(req.body.email, " ", req.body.cnic)
		const student = await Student.findOne({
			where: {
				email: req.body.email,
				cnic: req.body.cnic,
			},
		})
		if (student != null) {
			const key = randomstring.generate(255)
			PasswordResetLink.create({
				key: key,
				StudentId: student.id,
			})

			const reset_link =
				process.env.SITE_DOMAIN_NAME + "/set-new-password/" + key
			console.log(reset_link)

			try {
				await queueMail(
					student.email,
					`Reset Password`,
					{
						heading: `Reset Password`,
						inner_text: `Dear Student
            <br>
            This email contains your password reset link. Either copy paste the following link in your browser:
            <br>
            <a href="${reset_link}">${reset_link}</a>
            <br>
            Sincerely, 
            IEC Admissions Team`,
						button_announcer:
							"Or you can click on the following button to change your password",
						button_text: "Change Password",
						button_link: reset_link,
					},
					true
				)
				res.render("templates/error.ejs", {
					additional_info: "Check Your Inbox",
					error_message:
						"If your email and CNIC were correct, then we have sent you a Password Reset link at your email address. Please also check your spam folder.",
					action_link: "/student/login",
					action_link_text: "Click here to go to the student login page.",
				})
			} catch (err) {
				console.log("Password reset email sending failed.", err)
				res.sendStatus(500)
			}
		} else {
			res.redirect("/student/forgot-password?error=wrong-credentials")
		}
	}
)

router.get("/feedback", checkStudentAuthenticated, (req, res) => {
	res.render("student/feedback/index.ejs", {
		user_type: req.user.type,
	})
})

router.get("/assignments", checkStudentAuthenticated, async (req, res) => {
	try {
		let assignments = await Assignment.findAll({
			where: {
				StudentId: req.user.user.id,
			},
			include: { model: Quiz, required: true, include: { model: Section } },
			order: [["id", "desc"]],
		})

		let count = 0
		let result = []
		result = await new Promise((resolve) => {
			for (let i = 0; i < assignments.length; i++) {
				assignments[i].Quiz.countSections().then(async (num_sections) => {
					result.push({
						quiz_id: assignments[i].Quiz.id,
						num_sections: num_sections,
						quiz_title: assignments[i].Quiz.title,
						createdAt: moment(assignments[i].createdAt).format("Do MMMM, YYYY"),
					})
					const cur_index = result.length - 1

					const attempted_sections = await Attempt.findAndCountAll({
						where: {
							AssignmentId: assignments[i].id,
						},
					})

					result[cur_index].status = calculateSingleAssessmentStatus(
						attempted_sections,
						num_sections
					)
					count++
					if (count == assignments.length) {
						resolve(result)
					}
				})
			}
		})
		res.json(result)
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

router.get("/matching/", checkStudentAuthenticated, async (req, res) => {
	try {
		const student = await Student.findOne({
			where: {
				id: req.user.user.id,
			},
		})

		const matching = await InterviewMatching.findAll({
			where: {
				StudentId: student.id,
			},
		})

		//get interviewer names from their emails in all matchings
		for (let i = 0; i < matching.length; i++) {
			const interviewer = await Interviewer.findOne({
				where: {
					email: matching[i].interviewer_email,
				},
			})
			matching[i].interviewer_name = interviewer.name
		}

		//check if a slot has already been booked with the interviewer
		for (let i = 0; i < matching.length; i++) {
			const booking = await InterviewBookingSlots.findOne({
				where: {
					InterviewerId: matching[i].InterviewerId,
					StudentId: matching[i].StudentId,
					InterviewRoundId: matching[i].InterviewRoundId,
					booked: true,
				},
			})
			if (booking != null) {
				matching[i].booked = true
			} else {
				matching[i].booked = false
			}
		}

		const response = matching.map((match) => {
			return {
				id: match.id,
				interviewer_name: match.interviewer_name,
				student_id: match.StudentId,
				interviewer_id: match.InterviewerId,
				interviewer_email: match.interviewer_email,
				interview_round_id: match.InterviewRoundId,
				booked: match.booked,
				createdAt: match.createdAt,
			}
		})

		res.status(200).json(response)
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

router.get(
	"/interview/:interview_round_id/pick-timeslot/:interviewer_id",
	checkStudentAuthenticated,
	async (req, res) => {
		res.render("student/interview/pick-timeslot.ejs", {
			user_type: req.user.type,
			interviewer_id: req.params.interviewer_id,
			interview_round_id: req.params.interview_round_id,
		})
	}
)

router.get(
	"/interview/:interview_round_id/interviewer/:interviewer_id/booking-slots",
	checkStudentAuthenticated,
	async (req, res) => {
		try {
			const interview_round = await InterviewRound.findOne({
				where: {
					id: req.params.interview_round_id,
				},
			})
			if (interview_round == null) return res.sendStatus(404)

			const booking_slots = await InterviewBookingSlots.findAll({
				where: {
					InterviewRoundId: req.params.interview_round_id,
					InterviewerId: req.params.interviewer_id,
					booked: false,
				},
			})

			const response = booking_slots.map((slot) => {
				return {
					id: slot.id,
					InterviewRoundId: slot.InterviewRoundId,
					InterviewerId: slot.InterviewerId,
					start_time: slot.startTime,
					end_time: slot.endTime,
					duration: slot.duration,
					booked: slot.booked,
					createdAt: slot.createdAt,
					updatedAt: slot.updatedAt,
				}
			})

			res.status(200).json({
				booking_slots: response,
			})
		} catch (err) {
			console.log(err)
			res.sendStatus(500)
		}
	}
)

router.post(
	"/interview/:interview_round_id/interviewer/:interviewer_id/book-slot",
	checkStudentAuthenticated,
	async (req, res) => {
		try {
			const interview_round = await InterviewRound.findOne({
				where: {
					id: req.params.interview_round_id,
				},
			})
			if (interview_round == null)
				return res.status(404).json({
					success: false,
					message: "Booking slot not found or already booked.",
				})

			const booking_slot = await InterviewBookingSlots.findOne({
				where: {
					id: req.body.booking_slot_id,
					booked: false,
				},
			})
			if (booking_slot == null)
				return res.status(404).json({
					success: false,
					message: "Booking slot not found or already booked.",
				})

			const success = await InterviewBookingSlots.update(
				{
					booked: true,
					StudentId: req.user.user.id,
				},
				{
					where: {
						id: req.body.booking_slot_id,
					},
				}
			)

			const interviewDate = new Date(new Number(booking_slot.startTime))
				.toDateString()
				.split(" ")
				.slice(1)
				.join(" ")
			const startTime = new Date(
				new Number(booking_slot.startTime)
			).toLocaleTimeString()
			const endTime = new Date(
				new Number(booking_slot.endTime)
			).toLocaleTimeString()

			// send automated email to student
			const interviewer = await Interviewer.findOne({
				where: { id: req.params.interviewer_id },
			})
			const student = await Student.findOne({ where: { id: req.user.user.id } })
			try {
				await queueMail(student.email, `Interview Slot Booking Confirmation`, {
					heading: "Interview Slot Booking Confirmation",
					inner_text: `Dear Student, <br> You have successfully booked a slot with your interviewer ${interviewer.name} at ${interviewDate} from ${startTime} to ${endTime}. You will receive the meeting link before the interview time.<br>Please make sure you are on time for the interview. <br> <br> Best Regards, <br> Team Placement Cell`,
					button_announcer: null,
					button_text: null,
					button_link: null,
				})
			} catch (err) {
				console.log("Interview time email sending failed.")
			}

			if (success) {
				res.status(200).json({
					success: true,
					message: "Interview successfully booked!",
				})
			} else {
				res.status(500).json({
					success: false,
					message: "Booking slot not found or already booked.",
				})
			}
		} catch (err) {
			console.log(err)
			res.sendStatus(500)
		}
	}
)

// LEC Agreements

router.get("/lec-agreement", checkStudentAuthenticated, async (req, res) => {
	const student = await Student.findOne({ where: { id: req.user.user.id }, attributes: ["id"] })
	const round = (await student.getLECRounds({ include: [LECAgreementTemplate], order: [["id", "desc"]] }))[0]
	const agreement_template = round.LECAgreementTemplates[0]
	const submission = await LECAgreementSubmission.findOne({ where: { StudentId: req.user.user.id, LECRoundId: round.id, LECAgreementTemplateId: agreement_template.id }, order: [["id", "desc"]] })
	res.render("student/lec-agreement/index.ejs", {
		user_type: req.user.type,
		agreement_template_url: agreement_template.url,
		agreement_template_id: agreement_template.id,
		round_id: round.id,
		submission_exists: submission !== null
	})
})

router.post("/lec-agreement/upload", checkStudentAuthenticated, pdf_upload.single("file"), async (req, res) => {
	try {
		await LECAgreementSubmission.create({ LECAgreementTemplateId: req.body.agreement_template_id, StudentId: req.user.user.id, LECRoundId: req.body.round_id })
		res.send(`<i class="fas fa-check"></i></i> Your LEC Agreement has been uploaded successfully.`)
	} catch (err) {
		res.status(500).send("There was a problem with your submission. Please contact IEC Support Team at mail@iec.org.pk")
	}
})

router.get("/lec-agreement/get-latest-submission", checkStudentAuthenticated, async (req, res) => {
	try {
		const cnic = (await Student.findOne({ where: { id: req.user.user.id }, attributes: ["cnic"] })).cnic
		const command = new GetObjectCommand({
			Bucket: process.env.LEC_BUCKET_NAME,
			Key: `${cnic}.pdf`
		});

		try {
			const response = await s3.send(command);
			// The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
			const data = await response.Body.transformToByteArray()
			const buffer = Buffer.from(data);
			res.attachment(`${cnic}.pdf`).contentType("application/pdf").send(buffer)
		} catch (err) {
			console.error(err);
		}
	} catch (err) {
		console.log(err)
		res.sendStatus(404)
	}
});
module.exports = router
