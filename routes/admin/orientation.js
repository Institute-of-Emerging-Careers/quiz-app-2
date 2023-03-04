const express = require('express')
const router = express.Router()
const { DateTime } = require('luxon')
// My requirements
const checkAdminAuthenticated = require('../../db/check-admin-authenticated')
const {
	Orientation,
	OrientationInvite,
	Student,
	Assignment,
	Attempt,
	Score,
	Quiz,
	Section,
} = require('../../db/models')
const roundToTwoDecimalPlaces = require('../../functions/roundToTwoDecimalPlaces')
const getQuizTotalScore = require('../../functions/getQuizTotalScore')
const { queueMail } = require('../../bull')

// this file deals with /admin/orientation/...

// middleware that is specific to this router
router.use((req, res, next) => {
	next()
})

router.get('/', checkAdminAuthenticated, (req, res) => {
	console.log(`/admin/orientation${req.url}`)
	res.render('admin/orientation/index.ejs', {
		env: process.env.NODE_ENV,
		myname: req.user.user?.firstName,
		user_type: req.user.type,
		site_domain_name: process.env.SITE_DOMAIN_NAME,
		current_url: `/admin/orientation${req.url}`,
	})
})

router.get('/summary', checkAdminAuthenticated, (req, res) => {
	res.render('admin/orientation/summary.ejs', {
		myname: req.user.user?.firstName,
		user_type: req.user.type,
		site_domain_name: process.env.SITE_DOMAIN_NAME,
	})
})

router.get('/all', checkAdminAuthenticated, (req, res) => {
	Orientation.findAll({
		attributes: ['id', 'title'],
		order: [['id', 'desc']],
	}).then((response) => {
		res.json({ success: true, data: response })
	})
})

router.get(
	'/delete/:orientation_id',
	checkAdminAuthenticated,
	async (req, res) => {
		try {
			await Orientation.destroy({ where: { id: req.params.orientation_id } })
			res.json({ success: true })
		} catch (err) {
			res.json({ success: false })
		}
	}
)

router.get('/new/:quiz_id', checkAdminAuthenticated, (req, res) => {
	const new_orientation_name = `Orientation ${DateTime.now().toFormat(
		'hh:mm:ss-yyyy-LLL-dd'
	)}`
	Orientation.create({
		title: new_orientation_name,
		QuizId: req.params.quiz_id,
	}).then((orientation) => {
		res.render('admin/orientation/new.ejs', {
			orientation_name: new_orientation_name,
			orientation_id: orientation.id,
			env: process.env.NODE_ENV,
			user_type: req.user.type,
		})
	})
})

router.get(
	'/edit/:orientation_id',
	checkAdminAuthenticated,
	async (req, res) => {
		const orientation = await Orientation.findOne({
			where: { id: req.params.orientation_id },
			attributes: ['id', 'title'],
		})
		if (orientation != null) {
			res.render('admin/orientation/new.ejs', {
				orientation_id: orientation.id,
				orientation_name: orientation.title,
				env: process.env.NODE_ENV,
				user_type: req.user.type,
			})
		} else {
			res.render('templates/error.ejs', {
				additional_info: 'Invalid Orientation',
				error_message: "The orientation you're trying to edit does not exist.",
				action_link: '/orientation',
				action_link_text: 'Click here to go to the orientations page.',
			})
		}
	}
)

router.post(
	'/save/:orientation_id',
	checkAdminAuthenticated,
	async (req, res) => {
		try {
			const orientation = await Orientation.findOne({
				where: { id: req.params.orientation_id },
				include: [Quiz],
			})
			console.log(req.body.meeting_data)
			await orientation.update({
				title: req.body.orientation_name,
				date: req.body.meeting_data.date,
				time: req.body.meeting_data.time,
				meeting_link: req.body.meeting_data.zoom_link,
			})

			// let's get all students who have already been invited to this Orientation and create a hashmap.
			let orientation_invites = await OrientationInvite.findAll({
				where: { OrientationId: req.params.orientation_id },
			})

			let students_already_invited = new Map()
			orientation_invites.map((invite) => {
				students_already_invited.set(invite.StudentId, invite)
			})

			let i = 0
			const n = req.body.students.length
			await new Promise((resolve, reject) => {
				req.body.students.map(async (student) => {
					if (
						student.added == false &&
						students_already_invited.has(student.id)
					) {
						students_already_invited.get(student.id).destroy()
					} else if (
						student.added == true &&
						!students_already_invited.has(student.id)
					) {
						const application_id = (
							await Assignment.findOne({
								where: { QuizId: orientation.Quiz.id, StudentId: student.id },
								attributes: ['ApplicationId'],
							})
						).ApplicationId
						await OrientationInvite.create({
							StudentId: student.id,
							OrientationId: req.params.orientation_id,
							ApplicationId: application_id,
						})
					}
					i++
					if (i == n) {
						resolve()
					}
				})
			})

			res.json({ success: true })
		} catch (err) {
			res.json({ success: false })
		}
	}
)

router.get(
	'/all-students/:orientation_id',
	checkAdminAuthenticated,
	async (req, res) => {
		try {
			const orientation = await Orientation.findOne({
				where: { id: req.params.orientation_id },
				attributes: ['id', 'QuizId'],
				include: [
					{
						model: Quiz,
						include: [
							Section,
							{
								model: Assignment,
								include: [
									{
										model: Student,
										include: [Orientation],
									},
									{ model: Attempt, include: [Score] },
								],
								where: { completed: true },
							},
						],
					},
				],
			})

			if (orientation != null && orientation.QuizId != null) {
				// finding total score of quiz
				let quiz_total_score = await getQuizTotalScore(orientation.Quiz)

				let data = [] //list of students who have solved this quiz and their data
				/*
          [
            {
              id:...,
              name:...,
              email:...,
              added:...,
              age:...,
              gender:...,
              total_score_achieved:...,
              percentage_score:...,
            }
          ]
        */

				let assignments = orientation.Quiz.Assignments

				if (assignments != null && assignments.length > 0) {
					await new Promise((resolve) => {
						let i = 0
						const n = assignments.length

						assignments.forEach(async (assignment) => {
							const total_score_achieved = assignment.Attempts.reduce(
								(final, cur) =>
									(final += cur.Score == null ? 0 : cur.Score.score),
								0
							)
							const orientation_invite = await OrientationInvite.findOne({
								where: {
									OrientationId: req.params.orientation_id,
									StudentId: assignment.Student.id,
								},
							})
							data.push({
								added:
									assignment.Student.hasOwnProperty('Orientations') &&
									assignment.Student.Orientations.length > 0 &&
									assignment.Student.Orientations.reduce(
										(hasThisOrientationId, cur) =>
											hasThisOrientationId
												? true
												: cur.id == req.params.orientation_id
												? true
												: false,
										false
									),
								email_sent:
									orientation_invite == null
										? false
										: orientation_invite.email_sent,
								id: assignment.Student.id,
								name:
									assignment.Student.firstName +
									' ' +
									assignment.Student.lastName,
								email: assignment.Student.email,
								age: assignment.Student.age,
								gender: assignment.Student.gender,
								total_score_achieved: total_score_achieved,
								assignment_completed_date: assignment.updatedAt,
								percentage_score: roundToTwoDecimalPlaces(
									(total_score_achieved / quiz_total_score) * 100
								),
							})
							i++
							if (i == n) resolve()
						})
					})
				}
				res.json({ success: true, data: data })
			} else {
				console.log('Error: QuizId: or orientation:', orientation, 'is NULL')
				res.json({ success: false })
			}
		} catch (err) {
			console.log(err)
			res.sendStatus(500)
		}
	}
)

router.get(
	'/get-meeting-data/:orientation_id',
	checkAdminAuthenticated,
	async (req, res) => {
		try {
			const orientation = await Orientation.findOne({
				where: { id: req.params.orientation_id },
			})
			console.log(orientation)
			res.json({
				meeting_data: {
					date: orientation.date == null ? '' : orientation.date,
					time: orientation.time == null ? '' : orientation.time,
					zoom_link:
						orientation.meeting_link == null ? '' : orientation.meeting_link,
				},
			})
		} catch (err) {
			console.log(err)
			res.sendStatus(500)
		}
	}
)

router.post('/send-emails', checkAdminAuthenticated, async (req, res) => {
	if (req.body.students != null && req.body.students.length > 0) {
		const email_content = req.body.email_content

		// let students = req.body.students.filter((student) => student.added);
		// this will be done before sending the request now to save network bandwidth

		let students = req.body.students
		let promises = students.map((student) => [
			OrientationInvite.update(
				{ email_sent: true },
				{
					where: {
						StudentId: student.id,
						OrientationId: req.body.orientation_id,
					},
				}
			),
			queueMail(student.email, `${email_content.subject}`, {
				heading: email_content.heading,
				inner_text: email_content.body,
				button_announcer: email_content.button_pre_text,
				button_text: email_content.button_label,
				button_link: email_content.button_url,
			}),
		])

		promises = promises.reduce((final, cur) => [...final, ...cur], [])
		Promise.all(promises)
			.then(() => {
				res.json({ success: true })
			})
			.catch((err) => {
				res.json({ success: false })
			})
	}
})

module.exports = router
