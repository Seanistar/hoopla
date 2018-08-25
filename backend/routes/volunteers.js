const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
const _promise = require('bluebird')

router.get('/', (req, res, next) => {
  const select = 'SELECT * FROM volunteers'
  const sql = [select, req.params.id]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/:id', (req, res, next) => {
  const select = 'SELECT * FROM volunteers' + (req.params.id === undefined ? '' : ' WHERE id=?')
  const sql = [select, req.params.id]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

const getCodeName = (code) => {
  return new _promise(function(resolve, reject) {
    let sql = null
    const [lc, mc, sc] = code.split('-');
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

router.get('/code/:cd', (req, res) => {
  getCodeName(req.query.code)
    .then(rows => {
      res.status(200).send(rows)
    })
    .error(e => {console.log("Error handler " + e)})
    .catch(e => {console.log("Catch handler " + e)})
})

router.put('/', (req, res, next) => {
  // console.log(req.body.volts)
  const {name, ca_name, birth_date, ca_date, la_code, ma_code, sa_code, email, phone, address, job, degree, auth_date, rec_date, memo} = req.body.volts
  const sql = [
    `INSERT INTO volunteers (name, ca_name, birth_date, ca_date, la_code, ma_code, sa_code, email, phone, address, job, degree, auth_date, rec_date, memo) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [name, ca_name, birth_date, ca_date, la_code, ma_code, sa_code, email, phone, address, job, degree, auth_date, rec_date, memo]
  ]

  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('volunteer has been inserted')
      res.status(200).send({success: true, lastId: rows.insertId})
      // res.redirect(`/scrap/${rows.insertId}`)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/:id', (req, res, next) => {
  const id = req.params.id
  const {name, ca_name, birth_date, ca_date, la_code, ma_code, sa_code, email, phone, address, job, degree, auth_date, rec_date, memo} = req.body
  const sql = [
    `UPDATE volunteers 
    SET name=?, ca_name=?, birth_date=?, ca_date=?, la_code=?, ma_code=?, sa_code=?,
    email=?, phone=?, address=?, job=?, degree=?, auth_date=?, rec_date=?, memo=?
    WHERE id=?`,
    [name, ca_name, birth_date, ca_date, la_code, ma_code, sa_code, email, phone, address, job, degree, auth_date, rec_date, memo, id]
  ]

  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send({success: true})
      // res.redirect(`/scrap/${id}`)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.delete('/:id', (req, res) => {
  if (req.params.id === undefined) {
    console.warn('error')
    res.send('no id parameter')
  }
  const sql = [`DELETE FROM volunteers WHERE id=?`, req.params.id]

  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send({success: true})
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

module.exports = router
