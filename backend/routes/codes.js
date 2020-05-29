const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
const _promise = require('bluebird')

router.get('/edu', (req, res)=> {
  db.query('SELECT * FROM edu_code WHERE used=\'Y\'', (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/area', (req, res) => {
  db.query('SELECT * FROM area_code WHERE used=\'Y\'', (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/area', (req, res) => {
  const {ac, lc, ln, mc, mn, sc, sn} = req.body
  let sql = ''
  if (sc !== undefined) sql = [`INSERT INTO area_code(a_code, l_code, l_name, m_code, m_name, s_code, s_name, used) 
    VALUES(?,?,?,?,?,?,?,'Y') ON DUPLICATE KEY UPDATE l_code=?, l_name=?, m_code=?, m_name=?, s_code=?, s_name=?`,
    [ac, lc, ln, mc, mn, sc, sn, lc, ln, mc, mn, sc, sn]]
  else if (mc !== undefined) sql = [`INSERT INTO area_code(a_code, l_code, l_name, m_code, m_name, used) 
    VALUES(?,?,?,?,?,'Y') ON DUPLICATE KEY UPDATE l_code=?, l_name=?, m_code=?, m_name=?`,
    [ac, lc, ln, mc, mn, lc, ln, mc, mn]]
  else if (lc !== undefined) sql = [`INSERT INTO area_code(a_code, l_code, l_name, used) 
    VALUES(?,?,?,'Y') ON DUPLICATE KEY UPDATE l_code=?, l_name=?`,
    [ac, lc, ln, lc, ln]]

  db.query(...sql, (err) => {
    if (!err) {
      const row = {a_code: ac, l_code: lc, l_name: ln, m_code: mc, m_name: mn, s_code: sc, s_name: sn}
      res.status(200).send(row)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.delete('/area/:code', (req, res) => {
  const sql = [`UPDATE area_code SET used=\'N\' WHERE a_code=?`, [req.params.code]]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/edu', (req, res) => {
  const {code, name, type} = req.body
  const sql = [`
    INSERT INTO edu_code(code, name, type) 
    VALUES(?,?,?) ON DUPLICATE KEY UPDATE name=?, type=?`,
    [code, name, type, name, type]
  ]
  db.query(...sql, (err, row) => {
    if (!err) {
      row = {code:parseInt(code), name, type}
      res.status(200).send(row)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

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
