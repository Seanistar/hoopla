const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')

router.get('/yearly', (req, res) => {
  const _sql = `
    SELECT act_code e_code, COUNT(id) counter, MAX(YEAR(a.e_date))e_year, c.name e_name
    FROM acts a
    LEFT JOIN edu_code c ON a.act_code = c.code
    GROUP BY YEAR(a.e_date), a.act_code`

  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat yearly has done')
      res.status(200).send(rows)
    } else {
      console.warn('stat yearly error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.get('/church', (req, res) => {
  const _sql = `
    SELECT act_code e_code, COUNT(id) counter, MAX(a.area_code)a_code, c.name e_name
    FROM acts a
    LEFT JOIN edu_code c ON a.act_code = c.code
    GROUP BY area_code, a.act_code`

  db.query(_sql, (err, rows) => {
    if (!err) {
      console.log('stat church has done')
      res.status(200).send(rows)
    } else {
      console.warn('stat church error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

module.exports = router
