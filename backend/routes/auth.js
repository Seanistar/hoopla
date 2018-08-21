const express = require('express')
const router = express.Router()
const db = require('../common/db.mysql')
const crypto = require('crypto')
const config = require('../config')

class User {
  constructor (name, pwd) {
    this.username = name
    this.password = pwd
  }

  verify (pwd) {
    const encrypted = crypto.createHmac('sha1', config.secret)
      .update(password)
      .digest('base64')
    console.log(this.password === encrypted)

    return this.password === encrypted
  }
}

router.post('/login', (req, res) => {
  const {username, password} = req.body
  const secret = req.app.get('jwt-secret')

  // check the user info & generate the jwt
  const check = (user) => {
    if(!user) {
      // user does not exist
      throw new Error('login failed')
    } else {
      // user exists, check the password
      if(user.verify(password)) {
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              username: user.username,
              admin: user.admin
            },
            secret,
            {
              expiresIn: '7d',
              issuer: 'seanistar.me',
              subject: 'userInfo'
            }, (err, token) => {
              if (err) reject(err)
              resolve(token)
            })
        })
        return p
      } else {
        throw new Error('login failed')
      }
    }
  }

  // respond the token
  const respond = (token) => {
    res.json({
      message: 'logged in successfully',
      token
    })
  }

  // error occured
  const onError = (error) => {
    res.status(403).json({
      message: error.message
    })
  }

  let user = new User(username, password)

})

router.get('/register', function (req, res, next) {
  const { username, password } = req.body
  let newUser = null

  const select = 'SELECT * FROM author' + (req.params.id === undefined ? '' : ' WHERE id=?')
  const sql = [select]
  if (req.params.id !== undefined) {
    sql.push(req.params.id)
  }
  db.query(...sql, function (err, rows) {
    if (!err) {
      console.log(rows)
      res.send(rows)
    } else {
      console.log('query error : ' + err)
      res.send(err)
    }
  })
})

module.exports = router