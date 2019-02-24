const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')

router.get('/yearly', (req, res) => {
  let _sql = 'SELECT e_code, SUM(counter)gp_count, SUM(members)uv_count, e_year FROM stat_yearly'
  const {church, area} = req.query
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
  let _sql = 'SELECT a_code, e_code, SUM(counter)gp_count, SUM(members)uv_count FROM stat_church'
  const {year, area} = req.query
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
  const _sql = 'SELECT * FROM stat_area'
  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat area has done')
      res.status(200).send(rows)
    } else {
      console.warn('stat area error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/volts', (req, res) => {
  const _sql = `
	SELECT MAX(area_code)a_code, a.s_name, COUNT(id)counter, YEAR(au_date)au_year 
	FROM volunteers v
	LEFT JOIN area_code a ON v.area_code = a.a_code
	GROUP BY area_code, au_year`
  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat volts has done')
      res.status(200).send(rows)
    } else {
      console.warn('stat volts error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

module.exports = router
