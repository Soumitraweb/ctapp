
const mysql = require('mysql2');
const config = require('./config');
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password
});

module.exports = pool.promise();