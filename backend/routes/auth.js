const express = require('express')
const router = express.Router()
const author = require('../common/auth.middleware')

router.use('/check', author)
router.get('/check', (req, res) => {
  res.json({
    success: true,
    info: req.decoded
  })
})

module.exports = router