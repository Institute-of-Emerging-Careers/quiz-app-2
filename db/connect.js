const { Sequelize } = require("sequelize");
const config = require("config");

const sequelize = new Sequelize(
  `${process.env.MYSQL_CONNECTION_STRING}${config.get("DB_NAME")}`,
  {
    dialect: "mysql",
    logging: process.env.NODE_ENV == "development" ? console.log : false,
    timezone: process.env.TIMEZONE_OFFSET,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection Established");
  })
  .catch((err) => {
    console.log(err, "Connection Failed");
  });

module.exports = sequelize;
