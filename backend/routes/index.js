const express = require('express')
const router = express.Router()

const volunteer = require('./volunteers')
const coder = require('./codes')
const admin = require('./admin')
const report = require('./reports')

router.use('/volts', volunteer)
router.use('/codes', coder)
router.use('/admin', admin)
router.use('/reports', report)

module.exports = router
