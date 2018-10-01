const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
const crypto = require('crypto')
const config = require('../common/config')
const _promise = require('bluebird')
const jwt = require('jsonwebtoken')

const encryptPassword = (pwd) => {
  if (!pwd) return null
  const encrypted = crypto.createHmac('sha1', config.secret).update(pwd).digest('base64')
  // console.log(encrypted)
  return encrypted
}

const findAdministrator = (id) => {
  return new _promise(function(resolve, reject) {
    const sql = [`
    SELECT admin_id id, admin_name name, ca_name, password pwd, level, area_code
    FROM admins WHERE admin_id=? AND used = 'Y'`, [id]]
    return db.query(...sql, (err, row) => {
      if (!err) {
        console.log('findAdmin query has done', row[0])
        resolve(row[0])
      } else {
        console.log('findAdmin query error : ' + err)
        reject(err)
      }
    })
  })
}

// check the user info & generate the jwt
router.post('/login', (req, res) => {
  const {id, pwd} = req.body
  const secret = req.app.get('jwt-secret')
  let author = null
  const verify = (user) => {
    if (user && user.pwd === encryptPassword(pwd)) {
      author = {
        id: user.id,
        name: user.name,
        ca_name: user.ca_name,
        area_code: user.area_code,
        level: user.level
      }
      return new _promise(function(resolve, reject) {
        jwt.sign(
          author, // payload
          secret,
          {
            expiresIn: '1d',
            issuer: 'biblemove.org',
            subject: 'IKTUS'
          }, (err, token) => {
            err ? reject(err) : resolve(token)
          })
      })
    } else {
      throw new Error('login failed')
    }
  }

  findAdministrator(id)
  .then(verify)
  .then(token => { // response the token
    res.status(200).json({
      admin: author,
      success: true,
      message: 'logged in successfully',
      token
    })
  })
  .catch(error => {
    console.warn(error)
    res.status(403).json({
      success: false,
      message: error.message
    })
  })
})

router.get('/', (req, res) => {
  const sql = [`
    SELECT id, level, admin_id, area_code, admin_name, ca_name, s_name,
    DATE(registered) reg_date, CONCAT(l_name, ' 교구 / ', s_name, ' 본당') area_name
    FROM admins a LEFT JOIN area_code c ON a.area_code = c.a_code
    WHERE a.used='Y'`
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('fetchAdmin query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.put('/register', (req, res) => {
  const {admin_id, area_code, admin_name, ca_name, password} = req.body
  // const one = await findAdministrator(admin_id)
  // console.log(one)
  // if (one) return res.status(409).send('id already exists')

  const sql = [`
    INSERT INTO admins (admin_id, area_code, admin_name, ca_name, password) 
    VALUES (?,?,?,?,?)`,
    [admin_id, area_code, admin_name, ca_name, encryptPassword(password)]
  ]
  console.log(sql)
  db.query(...sql, (err, rows) => {
    if (!err) {
      console.log('registerAdmin query has done')
      res.status(200).send({newID: rows.insertId})
    } else {
      console.warn('registerAdmin query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.post('/:id', (req, res) => {
  const {admin_id, area_code, admin_name, ca_name} = req.body
  const sql = [`
    UPDATE admins 
    SET admin_id=?, admin_name=?, ca_name=?, area_code=?
    WHERE id=?`,
    [admin_id, admin_name, ca_name, area_code, req.params.id]
  ]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('updateAdmin query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

router.delete('/:id', (req, res) => {
  if (req.params.id === undefined) {
    console.warn('no id parameter')
    return res.status(500).send('Internal Server Error')
  }
  const sql = [`DELETE FROM admins WHERE id=?`, req.params.id]
  // const sql = [`UPDATE admins SET used='N' WHERE id=?`, req.params.id]
  db.query(...sql, (err, rows) => {
    if (!err) {
      res.status(200).send(rows)
    } else {
      console.warn('deleteAdmin query error : ' + err)
      res.status(500).send('Internal Server Error')
    }
  })
})

module.exports = router