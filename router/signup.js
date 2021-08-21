
let express = require("express");
let router = express.Router();

module.exports = (Player) => {
    router.get("/", (req, res) => {
        res.render("html/login.html", {
            button_value : "SIGN UP",
            post : "/signup",
            href : "/login",
            msg : "Already",
            link : "Log In"
        });
    });

    router.post("/", async (req, res) => {
        let _id = req.body.id;
        let _password = req.body.password;

        await Player.create({
            id2 : _id,
            password : _password,
        });

        res.redirect("/login");
    });

    return router;
}