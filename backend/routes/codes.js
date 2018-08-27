const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
const _promise = require('bluebird')

router.get('/', function(req, res, next) {
  db.query('select * from edu_code', function (err, rows) {
    if (!err) {
      // console.log(rows)
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.send(err)
    }
  });
});

router.get('/area', function(req, res, next) {
  db.query('select * from area_code', function (err, rows) {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.send(err)
    }
  });
});

const getCodeName = (code) => {
  return new _promise(function(resolve, reject) {
    let sql = null
    const [lc, mc, sc] = code.split('-')
    if (sc !== undefined) sql = ['SELECT l_name,m_name,s_name FROM area_code WHERE l_code=? AND m_code=? AND s_code=?', [lc, mc, sc]]
    else if (mc !== undefined) sql = ['SELECT l_name,m_name FROM area_code WHERE l_code=? AND m_code=?', [lc, mc]]
    else if (lc !== undefined) sql = ['SELECT l_name FROM area_code WHERE l_code=?', [lc]]
    else reject('no result')

    return db.query(...sql, (err, rows) => {
      if (!err) {
        console.log('query has done')
        resolve(rows)
      } else {
        console.log('query error : ' + err)
        reject(err)
      }
    })
  })
}

router.get('/test', (req, res) => {
  getCodeName(req.query.code)
    .then(rows => {
      res.status(200).send(rows)
    })
    .error(e => {console.log("Error handler " + e)})
    .catch(e => {console.log("Catch handler " + e)})
})

module.exports = router