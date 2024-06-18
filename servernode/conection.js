const mysql2 = require('mysql2');


const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  database : 'iotproject',
  password : '',
  port : 3306
});


module.exports = pool;