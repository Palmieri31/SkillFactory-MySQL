/* eslint-disable linebreak-style */

const mysql = require('mysql');
const config = require('./config');

module.exports = () => mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
});
