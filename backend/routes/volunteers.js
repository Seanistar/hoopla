var express = require('express');
var router = express.Router();
var db = require('../common/db.mysql');

router.get('/', function(req, res, next) {
  const select = 'SELECT * FROM volunteers';
  const sql = [select, req.params.id];
  db.query(...sql, function (err, rows) {
    if (!err) {
      // console.log(rows);
      res.status(200).send(rows);
    } else {
      console.log('query error : ' + err);
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = router;
