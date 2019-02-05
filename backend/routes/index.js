const express = require('express')
const router = express.Router()

const auth = require('./auth')
const volunteer = require('./volunteers')
const coder = require('./codes')
const admin = require('./admin')
const report = require('./reports')
const stat = require('./stats')
const photo = require('./photos')
//const itsm = require('./itsm')

router.use('/auth', auth)
router.use('/volts', volunteer)
router.use('/codes', coder)
router.use('/admin', admin)
router.use('/reports', report)
router.use('/stats', stat)
router.use('/photos', photo)
//router.use('/itsm', itsm)

module.exports = router
