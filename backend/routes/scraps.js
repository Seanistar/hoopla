var express = require('express');
var router = express.Router();
var db = require('../db/mysql');

router.get('/', function(req, res, next) {
  db.query('SELECT * FROM scrap', function (err, rows) {
    if (!err) {
      // console.log(rows);
      res.status(200).send(rows);
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

router.get('/:id', function(req, res, next) {
  const select = 'SELECT * FROM scrap' + (req.params.id === undefined ? '' : ' WHERE id=?');
  const sql = [select, req.params.id];
  db.query(...sql, function (err, rows) {
    if (!err) {
      // console.log(rows);
      res.status(200).send(rows);
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

router.post('/', function(req, res, next) {
  const {title, content, author_id} = req.body.scrap;
  const sql = ['INSERT INTO scrap (title, content, author_id) VALUES (?,?,?)', [title, content, author_id]];
  db.query(...sql, function (err, rows) {
    if (!err) {
      console.log(rows.insertId)
      res.status(200).send({success: true, lastId: rows.insertId});
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

router.put('/:id', function(req, res, next) {
  const {title, content, author_id} = req.body;
  const sql = ['UPDATE scrap SET title=?, content=?, author_id=? WHERE id=?', [title, content, author_id, req.params.id]];
  db.query(...sql, function (err, rows) {
    if (!err) {
      res.status(200).send({success: true, inserted: rows});
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

router.delete('/:id', (req, res) => {
  const sql = [`DELETE FROM scrap WHERE id=?`, req.params.id];
  db.query(...sql, function (err, rows) {
    if (!err) {
      res.status(200).send({success: true});
    } else {
      console.log('query error : ' + err);
      res.send(err);
    }
  });
});

module.exports = router;