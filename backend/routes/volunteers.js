const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
// const _promise = require('bluebird')

/****************************************************************
 * volunteer information
 */
router.get('/', (req, res, next) => {
  db.query('SELECT * FROM volunteers', (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/page/:id', (req, res, next) => {
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

router.put('/', (req, res, next) => {
  const {name, ca_name, birth_date, ca_date, area_code, la_name, ma_name, sa_name, email, phone, address, job, degree, auth_date, rec_date, memo} = req.body
  const sql = [
    `INSERT INTO volunteers (name, ca_name, birth_date, ca_date, area_code, la_name, ma_name, sa_name, email, phone, address, job, degree, auth_date, rec_date, memo) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [name, ca_name, birth_date, ca_date, area_code, la_name, ma_name, sa_name, email, phone, address, job, degree, auth_date, rec_date, memo]
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
  const {name, ca_name, birth_date, ca_date, area_code, la_name, ma_name, sa_name, email, phone, address, job, degree, auth_date, rec_date, memo} = req.body
  const sql = [
    `UPDATE volunteers 
    SET name=?, ca_name=?, birth_date=?, ca_date=?, area_code=?, la_name=?, ma_name=?, sa_name=?,
    email=?, phone=?, address=?, job=?, degree=?, auth_date=?, rec_date=?, memo=?
    WHERE id=?`,
    [name, ca_name, birth_date, ca_date, area_code, la_name, ma_name, sa_name, email, phone, address, job, degree, auth_date, rec_date, memo, id]
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

/*******************************************************************
 * volunteer educations
 */
router.get('/edu/:id', (req, res) => {
  const select = `SELECT e.*, c.name edu_name 
  FROM edus e LEFT JOIN edu_code c ON e.edu_code=c.code WHERE v_id=?`
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

router.put('/edu', (req, res, next) => {
  const {v_id, edu_code, s_date, e_date, sv_ids, area_code, memo} = req.body
  const sql = [
    `INSERT INTO edus (v_id, edu_code, s_date, e_date, sv_ids, area_code, memo) 
    VALUES (?,?,?,?,?,?,?)`,
    [v_id, edu_code, s_date, e_date, sv_ids, area_code, memo]
  ]

  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('edu has been inserted')
      res.status(200).send({success: true, lastId: rows.insertId})
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/edu/:id', (req, res, next) => {
  const id = req.params.id
  const {v_id, edu_code, s_date, e_date, sv_ids, area_code, memo} = req.body
  const sql = [
    `UPDATE edus 
    SET v_id=?, edu_code=?, s_date=?, e_date=?, sv_ids=?, area_code=?, memo=?
    WHERE id=?`,
    [v_id, edu_code, s_date, e_date, sv_ids, area_code, memo, id]
  ]

  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send({success: true})
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.delete('/edu/:id', (req, res) => {
  if (req.params.id === undefined) {
    console.warn('error')
    res.status(505).send('no id parameter')
  }
  const sql = [`DELETE FROM edus WHERE id=?`, req.params.id]

  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send({success: true})
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

/**********************************************************
 * volunteer activities
 */
router.get('/act/:id', (req, res) => {
  db.query('SELECT * FROM acts', (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.put('/act', (req, res, next) => {
  const {v_id, grp_code, s_date, e_date, gv_ids, area_code, content} = req.body
  const sql = [
    `INSERT INTO acts (v_id, grp_code, s_date, e_date, gv_ids, area_code, content) 
    VALUES (?,?,?,?,?,?,?)`,
    [v_id, grp_code, s_date, e_date, gv_ids, area_code, content]
  ]

  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('act has been inserted')
      res.status(200).send({success: true, lastId: rows.insertId})
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/act/:id', (req, res, next) => {
  const id = req.params.id
  const {v_id, grp_code, s_date, e_date, gv_ids, area_code, content} = req.body
  const sql = [
    `UPDATE acts 
    SET v_id=?, grp_code=?, s_date=?, e_date=?, gv_ids=?, area_code=?, content=?
    WHERE id=?`,
    [v_id, grp_code, s_date, e_date, gv_ids, area_code, content, id]
  ]

  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send({success: true})
    } else {
      console.log('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.delete('/act/:id', (req, res) => {
  if (req.params.id === undefined) {
    console.warn('error')
    res.status(505).send('no id parameter')
  }
  const sql = [`DELETE FROM acts WHERE id=?`, req.params.id]

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
