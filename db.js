const { Pool } = require("pg");
require("dotenv").config();

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];

let sequelizenya;
if (config.use_env_variable) {
  sequelizenya = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelizenya = new Sequelize(config.database, config.username, config.password, config);
}


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
  sequelize: sequelizenya
});

module.exports = pool;
