const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')

router.get('/yearly', (req, res) => {
  const {church, area, type} = req.query
  let _sql = `SELECT e_code, SUM(counter)gp_count, SUM(members)uv_count, e_year FROM stat_yearly_${type}`
  if (church || area) {
    _sql += ' WHERE '
    if (area && church) {
      _sql += `a_code = '${church}' AND l_code = '${area}'`
    } else if(area) {
      _sql += `l_code = ${area}`
    } else {
      _sql += `a_code = '${church}'`
    }
  }
  _sql += ` GROUP BY e_year, e_code`
  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat yearly has done', _sql, req.query)
      res.status(200).send(rows)
    } else {
      console.warn('stat yearly error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/church', (req, res) => {
  const {year, area, type} = req.query
  let _sql = `SELECT a_code, e_code, SUM(counter)gp_count, SUM(members)uv_count FROM stat_church_${type}`
  if (year || area) {
    _sql += ' WHERE '
    if (year && area) {
      _sql += `e_year = ${year} AND l_code = '${area}'`
    } else if(area) {
      _sql += `l_code = '${area}'`
    } else {
      _sql += `e_year = ${year}`
    }
  }
  _sql += ' GROUP BY a_code, e_code'
  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat church has done', _sql)
      res.status(200).send(rows)
    } else {
      console.warn('stat church error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/area', (req, res) => {
  const {type} = req.query
  const _sql = `SELECT * FROM stat_area_${type}`
  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat area has done', _sql)
      res.status(200).send(rows)
    } else {
      console.warn('stat area error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/volts', (req, res) => {
  const {area} = req.query
  let _sql = ''
  if (area) {
    _sql = `SELECT MAX(area_code)a_code, a.s_name a_name, COUNT(id)counter, YEAR(au_date)au_year 
    FROM volunteers v
    INNER JOIN area_code a ON v.area_code = a.a_code`
    if (area) _sql += ` WHERE a.l_code = '${area}'`
    _sql += ` GROUP BY area_code, au_year`
  } else {
    _sql = `SELECT MAX(a.l_code)a_code, MAX(a.l_name)a_name, COUNT(id)counter, YEAR(au_date)au_year
    FROM volunteers v
    INNER JOIN area_code a ON v.area_code = a.a_code
    GROUP BY a.l_code, au_year`
  }

  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat volts has done', _sql)
      res.status(200).send(rows)
    } else {
      console.warn('stat volts error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/acts', (req, res) => {
  const {code} = req.query
  const _sql = `SELECT * FROM 
      (SELECT a.v_id, a.act_code a_code, null ready,
      a.area_code ch_code, a.origin_code og_code, 
      v.NAME v_name, v.ca_name, YEAR(a.s_date)a_year
      FROM acts a
      LEFT JOIN edu_code ec ON a.act_code = ec.code
      LEFT JOIN volunteers v ON a.v_id = v.id
      UNION
      SELECT e.v_id, e.edu_code a_code, ready, 
      e.area_code ch_code, null, 
      v.NAME v_name, v.ca_name, YEAR(e.s_date)a_year
      FROM edus e
      LEFT JOIN edu_code ec ON e.edu_code = ec.code
      LEFT JOIN volunteers v ON e.v_id = v.id
      WHERE ec.TYPE = 'N') UV
      WHERE ch_code = '${code}'
      ORDER BY v_id`
  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat acts has done', _sql)
      res.status(200).send(rows)
    } else {
      console.warn('stat acts error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

module.exports = router
