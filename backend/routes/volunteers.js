const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
// const _promise = require('bluebird')

/****************************************************************
 * volunteer information
 */
router.get('', (req, res) => {
  let select = `
    SELECT vl.*, ac.l_name la_name, ac.m_name ma_name, ac.s_name sa_name 
    FROM volunteers vl 
    LEFT JOIN area_code ac ON vl.area_code = ac.a_code `
  if (req.query.code) select += `WHERE vl.area_code = ?`
  const sql = [select, req.query.code ? [req.query.code] : []]
  // console.log(sql)
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/page/:id', (req, res) => {
  let select = `
    SELECT vl.*, ld.work l_work, ld.s_date ls_date, ld.e_date le_date, 
    ac.l_name la_name, ac.m_name ma_name, ac.s_name sa_name 
    FROM volunteers vl
    LEFT JOIN leaders ld ON vl.id = ld.v_id
    LEFT JOIN area_code ac ON vl.area_code = ac.a_code`
  if (req.params.id !== undefined) select += ' WHERE vl.id=?'
  const sql = [select, req.params.id]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.put('/', (req, res) => {
  const {name, ca_name, br_date, ca_date, state, area_code, ca_id, email, phone, address, job, degree, au_date, memo} = req.body
  const sql = [`
    INSERT INTO volunteers (name, ca_name, br_date, ca_date, state, area_code, ca_id, email, phone, address, job, degree, au_date, memo) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [name, ca_name, br_date, ca_date, state, area_code, ca_id, email, phone, address, job, degree, au_date, memo]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('volunteer has been inserted')
      res.status(200).send({newID: rows.insertId})
      // res.redirect(`/scrap/${rows.insertId}`)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/page/:id', (req, res) => {
  const id = req.params.id
  const {au_date, ca_id, name, ca_name, state, area_code, email, phone, address, job, degree, ca_date, br_date, memo} = req.body
  const sql = [`
    UPDATE volunteers 
    SET au_date=?, ca_id=?, name=?, ca_name=?, state=?, area_code=?,
    email=?, phone=?, address=?, job=?, degree=?, ca_date=?, br_date=?, memo=?
    WHERE id=?`,
    [au_date, ca_id, name, ca_name, state, area_code, email, phone, address, job, degree, ca_date, br_date, memo, id]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('volunteer has been updated')
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
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

/*******************************************************************
 * volunteer educations
 */
router.get('/edu/:id', (req, res) => {
  const select = `
    SELECT e.*, c.name edu_name, CONCAT(v.name, ' ', v.ca_name) gv_name
    FROM edus e
    LEFT JOIN volunteers v ON v.id = e.gv_id
    LEFT JOIN edu_code c ON e.edu_code=c.code
    WHERE v_id=?`
  const sql = [select, req.params.id]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.put('/edu', (req, res) => {
  const {v_id, edu_code, s_date, e_date, gv_id, area_code, memo} = req.body
  const sql = [`
    INSERT INTO edus (v_id, edu_code, s_date, e_date, area_code, gv_id, memo) 
    VALUES (?,?,?,?,?,?,?)`,
    [v_id, edu_code, s_date, e_date, area_code, gv_id, memo]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('edu has been inserted')
      res.status(200).send({newID: rows.insertId})
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/edu/:id', (req, res) => {
  const id = req.params.id
  const {v_id, edu_code, s_date, e_date, area_code, memo} = req.body
  const sql = [`
    UPDATE edus 
    SET v_id=?, edu_code=?, s_date=?, e_date=?, area_code=?, memo=?
    WHERE id=?`,
    [v_id, edu_code, s_date, e_date, area_code, memo, id]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send({success: true})
    } else {
      console.warn('query error : ' + err)
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
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

/**********************************************************
 * volunteer activities
 */
router.get('/act/:id', (req, res) => {
  const select = `
    SELECT a.*, c.name act_name, r.s_name 
    FROM acts a 
    LEFT JOIN edu_code c ON a.act_code = c.code
    LEFT JOIN area_code r ON a.area_code = r.a_code  
    WHERE v_id=?`
  db.query(select, req.params.id, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.put('/act', (req, res) => {
  const {v_id, act_code, s_date, e_date, area_code, numbers, content} = req.body
  const sql = [`
    INSERT INTO acts (v_id, act_code, s_date, e_date, area_code, numbers, content) 
    VALUES (?,?,?,?,?,?,?)`,
    [v_id, act_code, s_date, e_date, area_code, numbers, content]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('act has been inserted')
      res.status(200).send({newID: rows.insertId})
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/act/:id', (req, res) => {
  const id = req.params.id
  const {act_code, s_date, e_date, area_code, numbers, content} = req.body
  const sql = [`
    UPDATE acts 
    SET act_code=?, s_date=?, e_date=?, area_code=?, numbers=?, content=?
    WHERE id=?`,
    [act_code, s_date, e_date, area_code, numbers, content, id]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send({success: true})
    } else {
      console.warn('query error : ' + err)
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
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

/****************************************************************
 * volunteer querying
 */
router.get('/query', (req, res) => {
  const {a_code, au_date, v_name, sa_code} = req.query
  let sql = `
    SELECT vl.*, ac.l_name la_name, ac.m_name ma_name, ac.s_name sa_name,
    (SELECT COUNT(DISTINCT id) FROM edus WHERE v_id = vl.id) edu_count,
    (SELECT COUNT(DISTINCT id) FROM acts WHERE v_id = vl.id) act_count 
    FROM volunteers vl LEFT JOIN area_code ac ON vl.area_code = ac.a_code
    WHERE 1 = 1`
  if (a_code) sql += ` AND vl.area_code like (\'${a_code}%\')`
  if (au_date) sql += ` AND YEAR(vl.au_date) >= ${au_date}`
  if (v_name) sql += ` AND vl.name like (\'%${v_name}%\')`
  if (sa_code) sql += ` AND vl.area_code = (\'${sa_code}\')`
  // console.log('query... ', sql, a_code, au_date)
  db.query(sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/find', (req, res) => {
  const {name} = req.query
  const select = `
    SELECT vl.*, ac.s_name sa_name
    FROM volunteers vl LEFT JOIN area_code ac ON vl.area_code = ac.a_code
    WHERE vl.name like (\'%${name}%\')`
  // console.log(select, req.query)
  db.query(select, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

/****************************************************************
 * volunteer leader
 */
router.get('/leader/:id', (req, res) => {
  const select = `
    SELECT *, c.s_name area_name
    FROM leaders l
    LEFT JOIN area_code c ON l.area_code = c.a_code
    WHERE v_id=?`
  db.query(select, req.params.id, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.put('/leader', (req, res) => {
  const {v_id, work, area_code, s_date, e_date} = req.body
  const sql = [`
    INSERT INTO leaders (v_id, work, area_code, s_date, e_date) 
    VALUES (?,?,?,?,?,?)`,
    [v_id, work, area_code, s_date, e_date]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('leader has been inserted')
      res.status(200).send({newID: rows.insertId})
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/leader/:id', (req, res) => {
  const {v_id, work, area_code, s_date, e_date} = req.body
  const sql = [`
    UPDATE leaders 
    SET v_id=?, work=?, area_code=?, s_date=?, e_date=? 
    WHERE id=?`,
    [v_id, work, area_code, s_date, e_date, req.params.id]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('leader has been updated')
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

/****************************************************************
 * volunteer history
 */
router.get('/history/:id', (req, res) => {
  const select = `
    SELECT *, DATE(created) do_date 
    FROM histories
    WHERE v_id=?`
  db.query(select, req.params.id, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.put('/history', (req, res) => {
  const {v_id, in_code, in_name, out_code, out_name} = req.body
  const sql = [`
    INSERT INTO histories (v_id, in_code, in_name, out_code, out_name) 
    VALUES (?,?,?,?,?)`,
    [v_id, in_code, in_name, out_code, out_name]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('history has been inserted')
      res.status(200).send({newID: rows.insertId})
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

module.exports = router
