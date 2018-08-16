const mysql = require('mysql');

/*const connector = mysql.createConnection({
  host: '45.77.24.97',
  user: 'grit',
  password: '0917Grit!',
  database: 'medium'
});*/

const connector =  mysql.createPool({
  connectionLimit : 10,
  host: '45.77.24.97',
  user: 'grit',
  password: '0917Grit!',
  database: 'medium'
});

setInterval(function () {
  connector.query('SELECT 1');
}, 5000);
/*
connector.connect(function(err) {
  if (!err) {
    console.log("Database is connected ...");
  } else {
    console.error("Error connecting database ...");
    throw err;
  }
});
*/

module.exports = connector;