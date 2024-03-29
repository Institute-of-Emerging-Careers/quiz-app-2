// Note: the application.js routes inside the admin folder catch the routes /admin/application/* whereas this application.js file catches routes /application/*
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const checkAnyoneAlreadyAuthenticated = require("../db/check-anyone-already-authenticated")
const {
	ApplicationRound,
	Application,
	Student,

} = require("../db/models")


//why is this here?
router.use((req, res, next) => {
	next()
})

router.get(
	"/fill/:application_round_id",
	checkAnyoneAlreadyAuthenticated,
	async (req, res) => {
		try {
			const application_round = await ApplicationRound.findOne({
				where: { id: req.params.application_round_id },
			})
			console.log(req.params.application_round_id);
			if (!application_round.open) {
				res.render("templates/error.ejs", {
					additional_info: "Applications Closed",
					error_message:
						"Applications have closed for this cohort. Keep an eye on our website for future cohort updates.",
					action_link: "https://iec.org.pk",
					action_link_text: "Click here to go to the IEC Website",
				})
			} else {
				if (application_round != null) {
					res.render("application.ejs", {
						env: process.env.NODE_ENV,
						application_round_id: req.params.application_round_id,
					})
				} else {
					res.render("templates/error.ejs", {
						additional_info: "",
						error_message:
							"This link is invalid or something went wrong at the server. Error code 01.",
						action_link: "/",
						action_link_text: "Click here to go to home page.",
					})
				}
			}
		} catch (err) {
			console.log(err)
			res.render("templates/error.ejs", {
				additional_info: "",
				error_message:
					"This link is invalid or something went wrong. Error code 02.",
				action_link: "/",
				action_link_text: "Click here to go to home page.",
			})
		}
	}
)

router.post(
	"/check-if-user-exists",
	checkAnyoneAlreadyAuthenticated,
	async (req, res) => {
		if (
			!req.body.hasOwnProperty("application_round_id") ||
			!req.body.hasOwnProperty("email") ||
			!req.body.hasOwnProperty("cnic")
		) {
			res.sendStatus(400)
			return
		}

		const application_round = await ApplicationRound.findOne({
			where: { id: req.body.application_round_id },
		})
		if (application_round == null) {
			res.sendStatus(400)
			return
		}

		const student = [
			await Student.findOne({
				where: { email: req.body.email, cnic: req.body.cnic },
				attributes: ["id"],
			}),
			await Student.findOne({
				where: { cnic: req.body.cnic },
				attributes: ["id", "email"],
			}),
			await Student.findOne({
				where: { email: req.body.email },
				attributes: ["id", "cnic"],
			}),
		]

		// check if student with this email/cnic/both has already submitted an application for this cohort (ApplicationRound) before.
		if (student[0] != null || student[1] != null || student[2] != null) {
			const student_found = student.reduce((found, cur) => {
				if (found != null) return found
				if (cur != null) return cur
			}, null)

			const old_application = await student_found.getApplications({
				where: { ApplicationRoundId: req.body.application_round_id },
			})
			if (old_application.length > 0) {
				res.json({ exists: true, type: "already_applied" })
				return
			}
		}

		if (student[0] != null) {
			res.json({ exists: true, type: "both_cnic_and_email" })
		} else if (student[1] != null) {
			res.json({
				exists: true,
				type: "cnic_only",
				email: student[1].email.replace(
					/(\w{3})[\w.-]+@([\w.]+\w)/,
					"$1***@$2"
				),
			})
		} else if (student[2] != null)
			res.json({ exists: true, type: "email_only" })
		else {
			res.json({ exists: false })
		}
	}
)

router.post(
	"/submit/:application_round_id",
	checkAnyoneAlreadyAuthenticated,
	async (req, res) => {
		const errorField = (str) => {
			if (str == "students_email") return "email"
			else return str
		}

		const errorMessage = (err_field, err_type, err_msg) => {
			if (err_type == "unique violation")
				return `${err_field} is already taken. This means you have already applied before. Make sure you use the same pair of Email and CNIC as your last application.`
			else return err_msg
		}

		try {
			// Each Student has many Applications. We need to ascertain whether this student is new or exists previously.
			let student = await Student.findOne({
				where: { email: req.body.email, cnic: req.body.cnic },
			})
			if (student == null) {
				student = Student.build({
					email: req.body.email,
					cnic: req.body.cnic,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					gender: req.body.gender,
					password: await bcrypt.hash(req.body.password, 10),
				})
				console.log(req.body.firstName, req.body.lastName)
				await student.validate()
				student = await student.save()
			} else {
				const old_application = await student.getApplications({
					where: { ApplicationRoundId: req.params.application_round_id },
				})
				if (old_application.length > 0) {
					res.sendStatus(403)
					return
				}
			}

			// construct student object
			let obj = {}
			const unset_attributes = ["createdAt", "updatedAt", "id"] //to let these be set automatically
			for (let key in Application.rawAttributes) {
				obj[key] = req.body.hasOwnProperty(key) ? req.body[key] : null
			}
			unset_attributes.forEach((attr) => {
				delete obj[attr]
			})
			obj.StudentId = student.id
			obj.ApplicationRoundId = req.params.application_round_id
			obj.rejection_email_sent = false
			obj.assessment_email_sent = false

			// creating application
			let application = Application.build(obj)

			// validating application information
			await application.validate() //the "catch" gets this if validation fails
			application = await application.save()
			res.sendStatus(201)
		} catch (err) {
			if (err.errors) {
				console.log("application validation error: ", err.errors[0])
				const error_path_array = err.errors[0].path.split(".")
				let error_obj = {
					error: err.errors[0].type,
					field: errorField(
						error_path_array.length == 1
							? error_path_array[0]
							: error_path_array[1]
					),
					type: err.errors[0].validatorName,
					message: errorMessage(
						errorField(err.errors[0].path.split(".")[1]),
						err.errors[0].type,
						err.errors[0].message
					),
				}

				res.status(400).json(error_obj)
			} else {
				res.sendStatus(500)
				console.log(err)
			}
		}
	}
)

router.get("/change-cnic", (req, res) => {
	res.render("application/change_cnic.ejs")
})

router.get("/change-email", (req, res) => {
	res.render("application/change_email.ejs")
})

router.post("/change-cnic", async (req, res) => {
	const student = await Student.findOne({
		where: { email: req.body.email },
	})
	if (student != null) {
		try {
			if (await bcrypt.compare(req.body.password, student.password)) {
				student.cnic = req.body.cnic
				student.gender = req.body.gender
				await student.validate()
				await student.save()
				res.sendStatus(200)
			} else res.sendStatus(400)
		} catch (err) {
			res.sendStatus(400)
			console.log(err)
		}
	} else res.sendStatus(401)
})

router.post("/change-email", async (req, res) => {
	const student = await Student.findOne({
		where: { cnic: req.body.cnic },
	})
	if (student != null) {
		try {
			if (await bcrypt.compare(req.body.password, student.password)) {
				student.email = req.body.email
				student.gender = req.body.gender
				await student.validate()
				await student.save()
				res.sendStatus(200)
			} else res.sendStatus(400)
		} catch (err) {
			res.sendStatus(400)
			console.log(err)
		}
	} else res.sendStatus(401)
})

router.get("/:application_round_id/courses", async (req, res) => {
	try {
		const application_round = await ApplicationRound.findOne({
			where: { id: req.params.application_round_id },
		})

		const courses = await application_round.getCourses({
			attributes: ["id", "title"],
		})

		if (!courses) {
			res.status(404).json({
				success: false,
				message: "No courses found",
			})
		}

		res.status(200).json({
			success: true,
			message: "Successfully fetched courses",
			courses,
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		})
	}
})

module.exports = router
