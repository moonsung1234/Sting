
let express = require("express");
let socket = require("socket.io");
let nunjucks = require("nunjucks");
let path = require("path");
let dotenv = require("dotenv");

let CookieParser = require("cookie-parser");
let ExpressSession = require("express-session");

let { sequelize, Player } = require("./models");

let login_router = require("./router/login"); 
let signup_router = require("./router/signup");

let app = express();
let http = require("http").createServer(app);
let io = socket(http);

let Match = require("./models/match");
const router = require("./router/login");
let match = new Match(io);

/* ----------------------------------------------------------------------- */

dotenv.config("./env");

app.set("port", process.env.PORT || 80);
app.set("view engine", "html");

nunjucks.configure("public", {
    express : app,
    autoescape: true,
    watch : true
});

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(CookieParser(process.env.COOKIE_KEY));
app.use(ExpressSession({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_KEY,
    cookie : {
        maxAge : 60 * 1000 * 30,
        httpOnly : true,
        secure : false
    }
}));

// set database

sequelize.sync({ force : false })
.then(() => {
    console.log("Database Created!");
})
.catch((err) => {
    console.log(err);
});


// set socket

io.on("connection", socket => {    
    socket.emit("id", socket.id);

    socket.on("disconnect", reason => {
        match.event("dis", socket.id, socket.id);
        match.delete(socket.id);
    });

    socket.on("alive", info => {
        match.event("move", info, socket.id);
    });

    socket.on("move", info => {
        match.event("move", info, socket.id);
    });

    socket.on("state", info => {
        match.event("state", info, socket.id);
    });

    socket.on("match", id => {
        match.add(socket, id);

        console.log(id, " request a match!");
    });

    socket.on("call", state => {
        match.event("call", state, socket.id);
    });
});

app.get("/", (req, res) => {
    if(req.session.player) {
        res.render("html/front.html", {
            button_value : "1 vs 1 Match",
            onclick : "match();"
        });

    } else {
        res.render("html/front.html", {
            button_value : "Go Login",
            onclick : "location.href = '/login'"
        });
    }
});

app.get("/room", (req, res) => {
    res.json(match.room_list);
});

app.use("/login", login_router(Player));
app.use("/signup", signup_router(Player));

http.listen(app.get("port"), () => {
    console.log("Server Started!");
});