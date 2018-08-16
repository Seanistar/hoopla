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
  const sql = [`SELECT * FROM topic WHERE id=?`, req.params.id];
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
  // const aid = req.body['author_id'];
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

router.put('/edit/:id', function(req, res, next) {
  const title = req.body['title'];
  const content = req.body['content'];
  const aid = req.body['author_id'];
  const tid = req.params.id;
  db.query('UPDATE topic SET title=?, content=?, author_id=? WHERE id=?', [title, content, aid, tid], function (err, rows) {
    if (!err) {
      // console.log(rows);
      res.status(200).send({success: true});
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

router.delete('/:id', (req, res) => {
  const sql = [`DELETE FROM topic WHERE id=?`, req.params.id];
  db.query(...sql, function (err, rows) {
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