const lecRouter = require("express").Router();

lecRouter.get("/", (req, res) => {
    res.send("Hello World");
    }
);

module.exports = lecRouter;