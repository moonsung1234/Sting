
let express = require("express");
let router = express.Router();

module.exports = (Player) => {
    router.get("/", (req, res) => {
        res.render("html/login.html", {
            button_value : "LOG IN",
            post : "/login",
            href : "/signup",
            msg : "Don't",
            link : "Sign Up"
        });
    });

    router.post("/", async (req, res) => {
        let _id = req.body.id;
        let _password = req.body.password;
        let player = await Player.findOne({
            attributes : ["id2", "password"],
            where : {
                id2 : _id,
                password : _password
            }
        });

        if(req.session.player) {
            res.redirect("/");
        
        } else if(player) {
            req.session.player = {
                id : _id,
                password : _password
            }

            res.redirect("/");
        
        } else {
            res.redirect("/login");
        }
    });

    return router;
}