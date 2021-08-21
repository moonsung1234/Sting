
let Sequelize = require("sequelize");

module.exports = class Player extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            // "name" : {
            //     type : Sequelize.STRING(10),
            //     allowNull : false,
            //     unique : true
            // },
            "id2" : {
                type : Sequelize.STRING(20),
                allowNull : false,
                unique : true
            },
            "password" : {
                type : Sequelize.STRING(20),
                allowNull : false,
                unique : true
            },
            "created_at" : {
                type : Sequelize.DATE,
                allowNull : false,
                defaultValue : Sequelize.NOW
            }
        },
        {
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : "Player",
            tableName : "players",
            paranoid : true,
            charset : "utf8",
            collate : "utf8_general_ci"
        });
    }
} 