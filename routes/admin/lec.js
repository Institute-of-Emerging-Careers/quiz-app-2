const lecRouter = require("express").Router();
const { LECRound, Quiz, Section, Assignment, Student, Attempt, Score, LECRoundInvite } = require("../../db/models")
const getQuizTotalScore = require("../../functions/getQuizTotalScore")
const checkAdminAuthenticated = require("../../db/check-admin-authenticated")
const roundToTwoDecimalPlaces = require("../../functions/roundToTwoDecimalPlaces")

lecRouter.get("/", checkAdminAuthenticated, (req, res) => {
    res.render("admin/lec/index.ejs", {
        env: process.env.NODE_ENV,
        myname: req.user.user?.firstName,
        user_type: req.user.type,
        site_domain_name: process.env.SITE_DOMAIN_NAME,
        current_url: `/admin/LEC${req.url}`,
    });
});

lecRouter.get("/all", checkAdminAuthenticated, async (req, res) => {
    try {
        const rounds = await LECRound.findAll({ order: [["id", "desc"]] })
        res.status(200).json(rounds)
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
})

lecRouter.post("/create", checkAdminAuthenticated, async (req, res) => {
    try {
        await LECRound.create({ title: req.body.title, send_reminders: req.body.send_reminders, QuizId: req.body.source_assessment_id })
        const rounds = await LECRound.findAll({ order: [["id", "desc"]] })
        res.status(201).json(rounds)
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
})

lecRouter.get("/edit/:round_id", checkAdminAuthenticated, async (req, res) => {
    try {
        const round = await LECRound.findOne({ where: { id: req.params.round_id }, attributes: ["title"] })
        if (round === null) {
            res.sendStatus(404)
            return
        }
        res.render("admin/lec/edit.ejs", {
            env: process.env.NODE_ENV,
            user_type: req.user.type,
            lec_round_title: round.title,
            lec_round_id: req.params.round_id
        })
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
})

lecRouter.get("/all-students/:round_id", checkAdminAuthenticated, async (req, res) => {
    try {
        const round = await LECRound.findOne({
            where: { id: req.params.round_id },
            attributes: ["id", "QuizId"],
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
                                    include: [LECRound]
                                },
                                { model: Attempt, include: [Score] },
                            ],
                            where: { completed: true },
                        },
                    ],
                },
            ],
        })

        if (round !== null && round.QuizId !== null && round.Quiz !== null) {
            const quiz = round.Quiz
            // finding total score of quiz
            let quiz_total_score = await getQuizTotalScore(quiz)

            let data = [] //list of students who have solved this quiz and their data
            /* After this processing,
            data = [
                {
                id:...,
                name:...,
                email:...,
                added:...,
                age:...,
                gender:...,
                total_score_achieved:...,
                percentage_score:...,
                }, 
                {...},
                ...
            ]
            */

            let assignments = quiz.Assignments


            if (assignments != null && assignments.length > 0) {
                const round_invites = await Promise.all(
                    assignments.map(assignment => LECRoundInvite.findOne(
                        {
                            where: {
                                LECRoundId: req.params.round_id,
                                StudentId: assignment.Student.id,
                            },
                        }
                    ))
                )

                data = assignments.map((assignment, i) => {
                    const total_score_achieved = assignment.Attempts.reduce(
                        (sum, cur) => (sum += cur.Score?.score ?? 0),
                        0
                    )
                    const round_invite = round_invites[i]
                    const student = assignment.Student
                    return {
                        added:
                            student.hasOwnProperty("LECRounds") &&
                            student.LECRounds.length > 0 &&
                            student.LECRounds.some(round => round.id === req.params.round_id),
                        email_sent:
                            round_invite === null
                                ? false
                                : round_invite.num_emails_sent,
                        id: student.id,
                        name:
                            student.firstName +
                            " " +
                            student.lastName,
                        email: student.email,
                        age: student.age,
                        gender: student.gender,
                        total_score_achieved: total_score_achieved,
                        assignment_completed_date: assignment.updatedAt,
                        percentage_score: roundToTwoDecimalPlaces(
                            (total_score_achieved / quiz_total_score) * 100
                        ),
                    }
                })
            }
            res.json({ success: true, data: data })
        } else {
            res.sendStatus(401)
        }
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
})

module.exports = lecRouter;