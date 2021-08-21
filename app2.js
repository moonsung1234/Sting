
let express = require("express");
let app = express();

let nunjucks = require("nunjucks");

nunjucks.configure("public", {
    express : app,
    autoescape: true,
    watch : true
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("html/login.html");
});

app.listen(3000, () => {
    console.log("Test Server Run!");
});