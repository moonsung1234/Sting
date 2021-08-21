
let Sequelize = require("sequelize");
let Player = require("./player");

let env = process.env.NODE_ENV || "development";
let config = require("../config/config.json")[env];
let db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Player = Player;

Player.init(sequelize);

module.exports = db;