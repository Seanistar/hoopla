const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
const _promise = require('bluebird')

/****************************************************************
 * volunteer information
 */
router.get('', (req, res) => {
  let select = `
    SELECT v.*, IF(ISNULL(l.v_id), 'N', 'Y')is_leader,
    a.l_name la_name, a.m_name ma_name, a.s_name sa_name 
    FROM volunteers v
    LEFT JOIN leaders l ON v.id = l.v_id AND l.work = 'Y'
    LEFT JOIN area_code a ON v.area_code = a.a_code `
  if (req.query.code) select += `WHERE v.area_code = ?`
  else select += `LIMIT 100`
  const sql = [select, req.query.code ? [req.query.code] : []]
  console.log(sql)
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
    LEFT JOIN leaders ld ON vl.id = ld.v_id AND ld.work = 'Y'
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
  const {au_date, ca_id, name, ca_name, state, area_code, sex, email, phone, address, job, degree, ca_date, br_date, memo} = req.body
  const sql = [`
    UPDATE volunteers 
    SET au_date=?, ca_id=?, name=?, ca_name=?, state=?, area_code=?, sex=?,
    email=?, phone=?, address=?, job=?, degree=?, ca_date=?, br_date=?, memo=?
    WHERE id=?`,
    [au_date, ca_id, name, ca_name, state, area_code, sex, email, phone, address, job, degree, ca_date, br_date, memo, id]
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
    console.warn('no id parameter')
    return res.status(500).send('Internal Server Error')
  }
  const sql = [`DELETE FROM volunteers WHERE id=?`, req.params.id]
  db.query(...sql, (err) => {
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
    SELECT e.*, c.name edu_name, IF(ISNULL(e.gv_name), CONCAT(v.name, ' ', v.ca_name), e.gv_name) gv_name
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

router.put('/edu', async (req, res) => {
  const {v_id, edu_code, s_date, e_date, gv_id, area_code, gv_name, months, memo} = req.body
  if (edu_code === 53) { // 월교육 다중 생성
    const mns = months && months.split(',')
    let ms = []
    for (let m of mns) {
      let r = await insertEduItem(v_id, edu_code, m, gv_id, area_code, gv_name, memo)
      if(!r) return res.status(500).send('Internal Server Error')
      else ms.push(r)
    }
    res.status(200).send({newID: JSON.stringify(ms)})
  } else {
    const sql = [`
    INSERT INTO edus (v_id, edu_code, s_date, e_date, area_code, gv_id, gv_name, memo) 
    VALUES (?,?,?,?,?,?,?,?)`,
      [v_id, edu_code, s_date, e_date, area_code, gv_id, gv_name, memo]
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
  }
})

const insertEduItem = (v_id, e_code, month, gv_id, area_code, gv_name, memo) => {
  return new _promise(function(resolve) {
    let d = new Date()
    d.setMonth(month-1)
    d.setDate(1)
    const s_date = d.toISOString().substr(0, 10)
    d.setMonth(d.getMonth() + 1)
    d.setDate(d.getDate() - 1)
    const e_date = d.toISOString().substr(0, 10)
    // console.log(s_date, e_date)
    const sql = [`
    INSERT INTO edus (v_id, edu_code, s_date, e_date, area_code, gv_id, gv_name, memo) 
    VALUES (?,?,?,?,?,?,?,?)`,
      [v_id, e_code, s_date, e_date, area_code, gv_id, gv_name, memo]
    ]
    return db.query(...sql, (err, rows) => {
      if (!err) {
        console.log('insertEduItem query has done')
        resolve(rows.insertId)
      } else {
        console.warn('insertEduItem query error : ' + err)
        resolve(false)
      }
    })
  })
}

router.post('/edu/:id', (req, res) => {
  const id = req.params.id
  const {v_id, edu_code, s_date, e_date, area_code, gv_name, memo} = req.body
  const sql = [`
    UPDATE edus 
    SET v_id=?, edu_code=?, s_date=?, e_date=?, area_code=?, memo=?, gv_name=?
    WHERE id=?`,
    [v_id, edu_code, s_date, e_date, area_code, memo, gv_name, id]
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
  const {a_code, au_date, v_name, sa_code, memo} = req.query
  let sql = `
    SELECT vl.*, ac.l_name la_name, ac.m_name ma_name, ac.s_name sa_name,
    (SELECT COUNT(DISTINCT id) FROM edus WHERE v_id = vl.id) edu_count,
    (SELECT COUNT(DISTINCT id) FROM acts WHERE v_id = vl.id) act_count 
    FROM volunteers vl LEFT JOIN area_code ac ON vl.area_code = ac.a_code
    WHERE 1 = 1`
  if (a_code) sql += ` AND vl.area_code like (\'${a_code}%\')`
  if (au_date) sql += ` AND YEAR(vl.au_date) = ${au_date}`
  if (v_name) sql += ` AND vl.name like (\'%${v_name}%\')`
  if (sa_code) sql += ` AND vl.area_code = (\'${sa_code}\')`
  if (memo) sql += ` AND vl.memo like (\'%${memo}%\')`
  console.log('query... ', sql, req.query)
  db.query(sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/queried', (req, res) => {
  const {e_type, v_id} = req.query
  const e_sql = `
    SELECT edu_code e_code, COUNT(id) counter, MAX(YEAR(e.e_date))e_year, c.name e_name
    FROM edus e
    LEFT JOIN edu_code c ON e.edu_code = c.code
    WHERE c.type = ? AND e.v_id = ?
    GROUP BY YEAR(e.e_date), e.edu_code`
  const a_sql = `
    SELECT act_code e_code, COUNT(id) counter, MAX(YEAR(a.e_date))e_year, c.name e_name
    FROM acts a
    LEFT JOIN edu_code c ON a.act_code = c.code
    WHERE c.type = ? AND a.v_id = ?
    GROUP BY YEAR(a.e_date), a.act_code`
  let sql = [e_type === 'A' ? a_sql : e_sql, [e_type, v_id]]
  console.log('queried... ', sql)
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('queried error : ' + err)
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
    SELECT *, c.s_name area_name, IF(ISNULL(l.e_date), -1 , DATEDIFF(l.e_date, l.s_date)) period
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
  const {id, area_code, ls_date} = req.body
  const sql = [`
    INSERT INTO leaders (v_id, area_code, s_date) 
    VALUES (?,?,?)`,
    [id, area_code, ls_date]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('leader has started')
      res.status(200).send({newID: rows.insertId})
    } else {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/leader/:id', (req, res) => {
  const {ls_date, le_date} = req.body
  const sql = [`
    UPDATE leaders
    SET work=\'N\', s_date=?, e_date=? 
    WHERE v_id=? AND work = \'Y\'`,
    [ls_date, le_date, req.params.id]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('leader has completed', rows)
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

router.put('/history', async (req, res) => {
  const {v_id, in_code, in_name, out_code, out_name} = req.body
  await updateAreaCode(v_id, in_code)
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

const updateAreaCode = (id, a_code) => {
  return new _promise(function(resolve) {
    const sql = [`
      UPDATE volunteers
      SET area_code = ?
      WHERE id = ?`, [a_code, id]]
    return db.query(...sql, (err, rows) => {
      if (!err) {
        console.log('updateAreaCode query has done')
        resolve(true)
      } else {
        console.warn('updateAreaCode query error : ' + err)
        resolve(false)
      }
    })
  })
}

module.exports = router
