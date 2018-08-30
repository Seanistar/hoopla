const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
const crypto = require('crypto')
const config = require('../common/config')
const _promise = require('bluebird')

const encryptPassword = (pwd) => {
  const encrypted = crypto.createHmac('sha1', config.secret).update(pwd).digest('base64')
  // console.log(encrypted)
  return encrypted
}

const getPassword = (id) => {
  return new _promise(function(resolve, reject) {
    const sql = ['SELECT password pwd FROM admins WHERE admin_id=?', [id]]
    return db.query(...sql, (err, row) => {
      if (!err) {
        console.log('query getPassword has done')
        resolve(row.length ? row[0].pwd : '')
      } else {
        console.log('query getPassword error : ' + err)
        reject(err)
      }
    })
  })
}

router.post('/login', (req, res) => {
  const {name, pwd} = req.body

  getPassword(name)
    .then(admin_password => {
      // console.log(admin_password, encryptPassword(pwd), admin_password === encryptPassword(pwd))
      if (admin_password === encryptPassword(pwd)) {
        res.status(200).send('OK')
      } else {
        res.send('FAIL')
      }
    })
    .error(e => {console.log("Error handler " + e)})
    .catch(e => {console.log("Catch handler " + e)})
})


module.exports = router