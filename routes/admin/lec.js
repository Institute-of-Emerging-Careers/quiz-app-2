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

module.exports = lecRouter;