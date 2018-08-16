var express = require('express');
var router = express.Router();

var db = require('../db/mysql');

router.get('/', function(req, res, next) {
  db.query('select * from topic', function (err, rows) {
    if (!err) {
      console.log(rows);
      res.status(200).send(rows);
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

router.get('/page/:id', function(req, res, next) {
  const id = req.params.id;
  const sql = [`SELECT * FROM topic WHERE id=?`, id];
  db.query(...sql, function (err, rows) {
    if (!err) {
      console.log(rows);
      res.status(200).send(rows);
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

router.put('/add', function(req, res, next) {
  const title = req.body['title'];
  const content = req.body['content'];
  // const authorId = req.body['authorId'];
  db.query('INSERT INTO topic (title, content) VALUES(?,?)', [title, content], function (err, rows) {
    if (!err) {
      // console.log(rows);
      res.status(200).send({success: true});
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

router.put('/edit', function(req, res, next) {
  const title = req.body['title'];
  const content = req.body['content'];
  const topicId = req.body['topicId'];
  db.query('UPDATE topic SET title=?, content=? WHERE id=?', [title, content, topicId], function (err, rows) {
    if (!err) {
      // console.log(rows);
      res.status(200).send({success: true});
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

module.exports = router;