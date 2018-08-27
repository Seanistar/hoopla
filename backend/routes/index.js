const express = require('express')
const router = express.Router()

const scrap = require('./scraps')
const author = require('./authors')
const movie = require('./movies')
const topic = require('./topics')
const volunteer = require('./volunteers')
const coder = require('./codes')

router.use('/scraps', scrap)
router.use('/authors', author)
router.use('/movies', movie)
router.use('/topics', topic)
router.use('/volts', volunteer)
router.use('/codes', coder)

module.exports = router
