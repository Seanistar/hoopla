var express = require('express');
var router = express.Router();

var db = require('../db/mysql');

router.get('/', function (req, res, next) {
  db.query('select * from author', function (err, rows) {
    if (!err) {
      console.log(rows);
      res.send(rows);
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

module.exports = router;