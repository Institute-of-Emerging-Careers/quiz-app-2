const express = require("express")
const router = express.Router()
const passport = require("passport")
const moment = require("moment")

// requirements
const checkAdminAuthenticated = require("../../db/check-admin-authenticated")
const checkAdminAlreadyLoggedIn = require("../../db/check-admin-already-logged-in")
const orientationRouter = require("./orientation")
const interviewRouter = require("./interview")
const applicationRouter = require("./application")
const lecRouter = require("./lec")
const { Quiz, Invite } = require("../../db/models")
const { email_bull_queue } = require("../../bull")

// middleware that is specific to this router
router.use("/application", applicationRouter)
router.use("/orientation", orientationRouter)
router.use("/interview", interviewRouter)
router.use("/lec", lecRouter)

router.use((req, res, next) => {
	next()
})

router.get("/all-quizzes", checkAdminAuthenticated, async (req, res) => {
	const all_quizzes = await Quiz.findAll({ order: [["id", "desc"]] });
	for (let i = 0; i < all_quizzes.length; i++) {
		all_quizzes[i].num_sections = await all_quizzes[i].countSections();
		const all_sections = await all_quizzes[i].getSections();
		let total_questions = 0;
		for (let j = 0; j < all_sections.length; j++) {
			total_questions += await all_sections[j].countQuestions();
		}
		all_quizzes[i].num_questions = total_questions;
	}
	res.json(all_quizzes)
})

router.get("/", checkAdminAuthenticated, async (req, res) => {
	try {
		res.render("admin/index.ejs", {
			myname: req.user.user?.firstName,
			user_type: req.user.type,
			site_domain_name: process.env.SITE_DOMAIN_NAME,
			moment: moment,
			query: req.query,
			current_url: `/admin${req.url}`,
			env: process.env.NODE_ENV,
		});
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

router.get("/login", checkAdminAlreadyLoggedIn, (req, res) => {
	res.render("admin/login/index.ejs")
})

router.post(
	"/login",
	passport.authenticate("admin-login", {
		successRedirect: "/admin",
		failureRedirect: "/admin/login",
		failureFlash: true,
	})
)

router.get("/retry-failed-emails", checkAdminAuthenticated, (req, res) => {
	email_bull_queue.getFailed().then((failed_jobs) => {
		Promise.all(failed_jobs.map((failed_job) => failed_job.retry()))
			.then(() => {
				res.sendStatus(200)
			})
			.catch((err) => {
				res.sendStatus(500)
				console.log(err)
			})
	})
})

router.get("/view-failed-emails", checkAdminAuthenticated, (req, res) => {
	email_bull_queue.getFailed().then((failed_jobs) => {
		res.json({ failed_jobs: failed_jobs })
	})
})

module.exports = router
