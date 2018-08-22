const express = require('express')
const router = express.Router()

const scrap = require('./scraps')
const author = require('./authors')
const movie = require('./movies')
const topic = require('./topics')
const volunteer = require('./volunteers')

router.use('/scraps', scrap)
router.use('/authors', author)
router.use('/movies', movie)
router.use('/topics', topic)
router.use('/volts', volunteer)

module.exports = router
