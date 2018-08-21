let mysql = require('mysql');

/*const connector = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});*/

const connector =  mysql.createPool({
  connectionLimit : 10,
  host: '',
  user: '',
  password: '',
  database: 'medium'
});

setInterval(function () {
  connector.query('SELECT 1');
}, 5000);

module.exports = connector;