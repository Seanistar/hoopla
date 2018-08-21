const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')

router.get('/:id?', function (req, res, next) {
  const select = 'SELECT * FROM author' + (req.params.id === undefined ? '' : ' WHERE id=?');
  const sql = [select]
  if (req.params.id !== undefined) {
    sql.push(req.params.id);
  }
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

router.post('/', function(req, res, next) {
  const {title, content, author_id} = req.body.scrap;
  const sql = ['INSERT INTO author (title, content, author_id) VALUES (?,?,?)', [title, content, author_id]];
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
  const sql = ['UPDATE author SET title=?, content=?, author_id=? WHERE id=?', [title, content, author_id, req.params.id]];
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
  if (req.params.id === undefined) {
    console.warn('error');
    res.send('no id parameter');
  }
  const sql = [`DELETE FROM author WHERE id=?`, req.params.id];
  db.query(...sql, function (err, rows) {
    if (!err) {
      res.status(200).send({success: true});
    } else {
      console.log('query error : ' + err);
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = router;