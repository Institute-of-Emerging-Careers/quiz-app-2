const lecRouter = require("express").Router();
const { LECRound } = require("../../db/models")
const checkAdminAuthenticated = require("../../db/check-admin-authenticated")

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
        await LECRound.create(req.body)
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

module.exports = lecRouter;