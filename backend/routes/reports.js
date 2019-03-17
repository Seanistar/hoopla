const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
const _promise = require('bluebird')

router.get('/', (req, res) => {
  const {code, year} = req.query
  let select = `SELECT * FROM reports `
  let cond = []
  if (code || year) {
    select += ' WHERE'
    if (code) {
      select += ' s_code=?'
      cond.push(code)
    }
    if (year) {
      if (code) select += ' AND'
      select += ' r_year=?'
      cond.push(year)
    }
  } else select += `LIMIT 100`
  const sql = [select, cond]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('reports query has done', sql)
      res.status(200).send(rows)
    } else {
      console.warn('reports query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/volts', (req, res) => {
  let {a_code, e_date} = req.query
  // e_date = `${e_date} 23:59:59`
  const sql = [`
    SELECT id, name, ca_name, ca_id, au_date, state, phone, br_date 
    FROM volunteers
    WHERE area_code=? AND au_date <= ?`,
    [a_code, e_date]
  ] // WHERE area_code=? AND registered <= DATE_FORMAT(?, '%Y-%m-%d %H:%i:%s')`
  console.log('report volts...', sql)
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('volts query has done')
      res.status(200).send(rows)
    } else {
      console.warn('volts query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/acts', (req, res) => {
  let {a_code, s_date, e_date} = req.query
  const sql = [`
    SELECT a.*, v.name, v.ca_name, v.ca_id, e.name act_name,
    CONCAT(a.v_id, '-', a.act_code) v_a_c 
    FROM acts a
    LEFT JOIN volunteers v ON a.v_id = v.id
    LEFT JOIN edu_code e ON e.code = a.act_code
    WHERE a.area_code=? AND (a.s_date>=? AND a.s_date<=?)`, //  AND a.e_date<=?
    [a_code, s_date, e_date]
  ]
  console.log('report acts...' + sql)
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('acts query has done')
      res.status(200).send(rows)
    } else {
      console.warn('acts query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/dynamic', (req, res) => {
  const {s_code, r_year} = req.query
  const sql = [`
    SELECT rb.r_code, ro.*, rs.*, rt.*
    FROM reports rb
    LEFT JOIN r_other ro ON rb.id = ro.r_id
    LEFT JOIN r_study rs ON rb.id = rs.r_id
    LEFT JOIN r_train rt ON rb.id = rt.r_id
    WHERE s_code=? AND r_year=?`,
    [s_code, r_year]]
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('dynamic query has done', sql)
      res.status(200).send(rows)
    } else {
      console.warn('dynamic query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/page/:id', (req, res) => {
  queryResult(req.params.id)
    .then(data => {
    res.status(200).send(data)
  }).catch(e => {
    console.warn('catch error : ', e)
    res.status(500).send('Internal Server Error')
  })
})

router.put('/', async (req, res) => {
  let prList = []
  try {
    console.log(req.body.data)
    const data = JSON.parse(req.body.data)
    if (!data.rb) throw new Error('no base')

    const numbers = await getVoltsNumber(data.rb.s_code) // s_date, e_date
    data.rb.numbers = numbers
    const newID = await updateData('reports', data.rb)
    if (!newID) throw new Error('failed to insert')

    prList.push(Promise.resolve(newID))
    data.rs && prList.push(updateData('r_study', data.rs, newID))
    data.rt && prList.push(updateData('r_train', data.rt, newID))
    data.ro && prList.push(updateData('r_other', data.ro, newID))
  } catch(e) {
    console.warn('parse error : ', e)
    return res.status(500).send('Internal Server Error')
  }

  Promise.all(prList).then(result => {
      console.log(result)
      res.status(200).send({newID: result[0]})
    }).catch(err => {
      console.warn('put query error : ' + err)
      res.status(500).send('Internal Server Error')
    })

})

router.post('/:id', (req, res) => {
  let prList = []
  try {
    if (!req.params.id) throw new Error('no id')
    console.log(req.body.data)
    const data = JSON.parse(req.body.data)

    data.rb && prList.push(updateData('reports', data.rb))
    data.rs && prList.push(updateData('r_study', data.rs, req.params.id))
    data.rt && prList.push(updateData('r_train', data.rt, req.params.id))
    data.ro && prList.push(updateData('r_other', data.ro, req.params.id))
  } catch (e) {
    console.warn('parse error : ', e)
    return res.status(500).send('Internal Server Error')
  }

  prList.length && Promise.all(prList)
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    })
})

router.delete('/:id', (req, res) => {
  if (!req.params.id) {
    console.warn('query error : no param')
    return res.status(500).send('Internal Server Error')
  }

  Promise.all([
    deleteData('r_other', req.params.id),
    deleteData('r_study', req.params.id),
    deleteData('r_train', req.params.id),
    deleteData('reports', req.params.id)
  ])
    .then((result) => {
      res.status(200).send(result)
    })
    .catch(err => {
      console.warn('query error : ' + err)
      res.status(500).send('Internal Server Error')
    })
})

router.get('/leader/:code', (req, res) => {
  getLeader(req.params.code)
  .then(ldr => {
    ldr && console.log('leader is...', ldr.lv_name, ldr.lv_id)
    res.status(200).send(ldr)
  }).catch(e => {
    console.warn('catch error : ', e)
    res.status(500).send('Internal Server Error')
  })
})

const queryResult = async (id) => {
  const ro = await getData('', id)
  if (!ro) return Promise.reject('no base')
  let res = {ro}

  const rs = await getData('r_study', id)
  if (!rs) return Promise.resolve(res)
  res.rs = {dg: {}, dp: {}, ng: {}, np: {}}
  rs && Object.keys(rs).forEach(k => {
    const [t, v] = k.split('_')
    let obj = {}; obj[v] = rs[k]
    if (['dg','dp','ng','np'].includes(t)) Object.assign(res.rs[t], obj)
  })

  const rt = await getData('r_train', id)
  if (!rt) return Promise.resolve(res)
  res.rt = {dg: {}, dp: {}, ng: {}, np: {}}
  rt && Object.keys(rt).forEach(k => {
    const [t, v] = k.split('_')
    let obj = {}; obj[v] = rt[k]
    if (['dg','dp','ng','np'].includes(t)) Object.assign(res.rt[t], obj)
  })

  return Promise.resolve(res)
}

const getData = (table, id) => {
  return new _promise(function(resolve) {
    let sql = null
    if (table) {
      sql = [`
      SELECT rs.* FROM reports r 
      LEFT JOIN ${table} rs ON r.id = rs.r_id
      WHERE r.id = ?`, [id]]
    } else {
      sql = [`
      SELECT r.*, ro.*, ac.s_name, 
      IF(ISNULL(lv_id), NULL, CONCAT(vl.name, '', vl.ca_name)) v_name 
      FROM reports r 
      LEFT JOIN r_other ro ON r.id = ro.r_id
      LEFT JOIN volunteers vl ON lv_id IS NOT NULL AND vl.id = r.lv_id
      LEFT JOIN area_code ac ON r.s_code = ac.a_code
      WHERE r.id = ?`, [id]]
    }
    return db.query(...sql, (err, rows) => {
      if (!err) {
        console.log('getData query has done')
        resolve(rows[0])
      } else {
        console.warn('getData query error : ' + err)
        resolve(null)
      }
    })
  })
}

const updateData = (table, obj, id) => {
  return new _promise(function(resolve, reject) {
    let sql = null
    if (table === 'r_study') {
      sql = [`
        INSERT INTO r_study(r_id, tt_dg, tt_dp, tt_ng, tt_np,
        dg_70, dp_70, ng_70, np_70, dg_71, dp_71, ng_71, np_71, dg_72, dp_72, ng_72, np_72, 
        dg_73, dp_73, ng_73, np_73, dg_74, dp_74, ng_74, np_74, dg_75, dp_75, ng_75, np_75,
        dg_76, dp_76, ng_76, np_76, dg_77, dp_77, ng_77, np_77, dg_78, dp_78, ng_78, np_78) 
        VALUES(?,
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
        tt_dg=?, tt_dp=?, tt_ng=?, tt_np=?, dg_70=?, dp_70=?, ng_70=?, np_70=?,
        dg_71=?, dp_71=?, ng_71=?, np_71=?, dg_72=?, dp_72=?, ng_72=?, np_72=?, 
        dg_73=?, dp_73=?, ng_73=?, np_73=?, dg_74=?, dp_74=?, ng_74=?, np_74=?, 
        dg_75=?, dp_75=?, ng_75=?, np_75=?, dg_76=?, dp_76=?, ng_76=?, np_76=?, 
        dg_77=?, dp_77=?, ng_77=?, np_77=?, dg_78=?, dp_78=?, ng_78=?, np_78=?`,
        [ id,
          obj.tt_dg, obj.tt_dp, obj.tt_ng, obj.tt_np,
          obj.dg_70, obj.dp_70, obj.ng_70, obj.np_70, obj.dg_71, obj.dp_71, obj.ng_71, obj.np_71,
          obj.dg_72, obj.dp_72, obj.ng_72, obj.np_72, obj.dg_73, obj.dp_73, obj.ng_73, obj.np_73,
          obj.dg_74, obj.dp_74, obj.ng_74, obj.np_74, obj.dg_75, obj.dp_75, obj.ng_75, obj.np_75,
          obj.dg_76, obj.dp_76, obj.ng_76, obj.np_76, obj.dg_77, obj.dp_77, obj.ng_77, obj.np_77,
          obj.dg_78, obj.dp_78, obj.ng_78, obj.np_78,
          obj.tt_dg, obj.tt_dp, obj.tt_ng, obj.tt_np,
          obj.dg_70, obj.dp_70, obj.ng_70, obj.np_70, obj.dg_71, obj.dp_71, obj.ng_71, obj.np_71,
          obj.dg_72, obj.dp_72, obj.ng_72, obj.np_72, obj.dg_73, obj.dp_73, obj.ng_73, obj.np_73,
          obj.dg_74, obj.dp_74, obj.ng_74, obj.np_74, obj.dg_75, obj.dp_75, obj.ng_75, obj.np_75,
          obj.dg_76, obj.dp_76, obj.ng_76, obj.np_76, obj.dg_77, obj.dp_77, obj.ng_77, obj.np_77,
          obj.dg_78, obj.dp_78, obj.ng_78, obj.np_78]
      ]
    } else if (table === 'r_train') {
      sql = [`
        INSERT INTO r_train(r_id, tt_dg, tt_dp, tt_ng, tt_np,
        dg_90, dp_90, ng_90, np_90, dg_91, dp_91, ng_91, np_91, dg_92, dp_92, ng_92, np_92, 
        dg_93, dp_93, ng_93, np_93, dg_94, dp_94, ng_94, np_94, dg_95, dp_95, ng_95, np_95,
        dg_96, dp_96, ng_96, np_96, dg_97, dp_97, ng_97, np_97, dg_98, dp_98, ng_98, np_98) 
        VALUES(?,
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
        tt_dg=?, tt_dp=?, tt_ng=?, tt_np=?, dg_90=?, dp_90=?, ng_90=?, np_90=?, 
        dg_91=?, dp_91=?, ng_91=?, np_91=?, dg_92=?, dp_92=?, ng_92=?, np_92=?, 
        dg_93=?, dp_93=?, ng_93=?, np_93=?, dg_94=?, dp_94=?, ng_94=?, np_94=?, 
        dg_95=?, dp_95=?, ng_95=?, np_95=?, dg_96=?, dp_96=?, ng_96=?, np_96=?, 
        dg_97=?, dp_97=?, ng_97=?, np_97=?, dg_98=?, dp_98=?, ng_98=?, np_98=?`,
        [ id,
          obj.tt_dg, obj.tt_dp, obj.tt_ng, obj.tt_np,
          obj.dg_90, obj.dp_90, obj.ng_90, obj.np_90, obj.dg_91, obj.dp_91, obj.ng_91, obj.np_91,
          obj.dg_92, obj.dp_92, obj.ng_92, obj.np_92, obj.dg_93, obj.dp_93, obj.ng_93, obj.np_93,
          obj.dg_94, obj.dp_94, obj.ng_94, obj.np_94, obj.dg_95, obj.dp_95, obj.ng_95, obj.np_95,
          obj.dg_96, obj.dp_96, obj.ng_96, obj.np_96, obj.dg_97, obj.dp_97, obj.ng_97, obj.np_97,
          obj.dg_98, obj.dp_98, obj.ng_98, obj.np_98,
          obj.tt_dg, obj.tt_dp, obj.tt_ng, obj.tt_np,
          obj.dg_90, obj.dp_90, obj.ng_90, obj.np_90, obj.dg_91, obj.dp_91, obj.ng_91, obj.np_91,
          obj.dg_92, obj.dp_92, obj.ng_92, obj.np_92, obj.dg_93, obj.dp_93, obj.ng_93, obj.np_93,
          obj.dg_94, obj.dp_94, obj.ng_94, obj.np_94, obj.dg_95, obj.dp_95, obj.ng_95, obj.np_95,
          obj.dg_96, obj.dp_96, obj.ng_96, obj.np_96, obj.dg_97, obj.dp_97, obj.ng_97, obj.np_97,
          obj.dg_98, obj.dp_98, obj.ng_98, obj.np_98 ]
      ]
    } else if (table === 'r_other') {
      sql = [`
        INSERT INTO r_other(r_id, b_40_d, b_40_n, m_sa_c, m_sa_n, m_hd_c, m_hd_n, e_sa_c, e_sa_n,
        e_hd_c, e_hd_n, v_act_f, v_act_m, v_brk_f, v_brk_m, v_rsv_f, v_rsv_m) 
        VALUES(?,
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
        b_40_d=?, b_40_n=?, m_sa_c=?, m_sa_n=?, m_hd_c=?, m_hd_n=?, e_sa_c=?, e_sa_n=?,
        e_hd_c=?, e_hd_n=?, v_act_f=?, v_act_m=?, v_brk_f=?, v_brk_m=?, v_rsv_f=?, v_rsv_m=?`,
        [ id,
          obj.b_40_d, obj.b_40_n, obj.m_sa_c, obj.m_sa_n, obj.m_hd_c, obj.m_hd_n, obj.e_sa_c, obj.e_sa_n,
          obj.e_hd_c, obj.e_hd_n, obj.v_act_f, obj.v_act_m, obj.v_brk_f, obj.v_brk_m, obj.v_rsv_f, obj.v_rsv_m,
          obj.b_40_d, obj.b_40_n, obj.m_sa_c, obj.m_sa_n, obj.m_hd_c, obj.m_hd_n, obj.e_sa_c, obj.e_sa_n,
          obj.e_hd_c, obj.e_hd_n, obj.v_act_f, obj.v_act_m, obj.v_brk_f, obj.v_brk_m, obj.v_rsv_f, obj.v_rsv_m ]
      ]
    } else {
      sql = [`
        INSERT INTO reports(r_code, s_code, name, r_half, r_year, lv_id, numbers, s_date, e_date) 
        VALUES(?
        ,?,?,?,?,?,?,?,?) 
        ON DUPLICATE KEY UPDATE s_code=?, name=?, r_half=?, r_year=?, lv_id=?, numbers=?, s_date=?, e_date=?`,
        [ obj.r_code,
          obj.s_code, obj.name, obj.r_half, obj.r_year, obj.lv_id, obj.numbers, obj.s_date, obj.e_date,
          obj.s_code, obj.name, obj.r_half, obj.r_year, obj.lv_id, obj.numbers, obj.s_date, obj.e_date ]
      ]
    }
    return db.query(...sql, (err, rows) => {
      if (!err) {
        console.log(`updateData ${table} query has done`, table !== 'reports' ? rows.affectedRows : rows.insertId)
        resolve(table === 'reports' ? rows.insertId : rows.affectedRows)
      } else {
        console.warn('updateData query error : ' + err)
        reject(err)
      }
    })
  })
}

const deleteData = (table, id) => {
  return new _promise(function(resolve, reject) {
    let sql = null
    if (table === 'reports') sql = [`DELETE FROM reports WHERE id=?`, id]
    else sql = [`DELETE FROM ${table} WHERE r_id=?`, id]
    return db.query(...sql, (err, rows) => {
      if (!err) {
        console.log('deleteData query has done')
        resolve(rows)
      } else {
        console.warn('deleteData query error : ' + err)
        reject(err)
      }
    })
  })
}

const getLeader = (a_code) => {
  return new _promise(function(resolve, reject) {
    const sql = [`
      SELECT CONCAT(name, ' ', ca_name)lv_name, v_id lv_id
      FROM leaders l LEFT JOIN volunteers v ON v.id = l.v_id 
      WHERE l.work = 'Y' AND l.area_code = ?`, [a_code]]
    return db.query(...sql, (err, rows) => {
      if (!err) {
        console.log('getLeader query has done')
        resolve(rows[0])
      } else {
        console.warn('getLeader query error : ' + err)
        reject(err)
      }
    })
  })
}

const getVoltsNumber = (a_code) => {
  return new _promise(function(resolve) {
    const sql = [`
      SELECT COUNT(DISTINCT id) numbers
      FROM volunteers
      WHERE state = 'ACT' AND area_code = ?`, [a_code]]
    return db.query(...sql, (err, rows) => {
      if (!err) {
        console.log('getVoltsNumber query has done', rows[0])
        resolve(rows[0].numbers)
      } else {
        console.warn('getVoltsNumber query error : ' + err)
        resolve(0)
      }
    })
  })
}

module.exports = router