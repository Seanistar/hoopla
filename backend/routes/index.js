const express = require('express')
const router = express.Router()

const scrap = require('./scraps')
const author = require('./authors')
const movie = require('./movies')
const topic = require('./topics')

router.use('/scraps', scrap)
router.use('/authors', author)
router.use('/movies', movie)
router.use('/topics', topic)

module.exports = router
