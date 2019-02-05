const express = require('express');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/photos')
  },
  filename: function (req, file, cb) {
    //console.log(file.originalname,  req.body.cid)
    const d = new Date()
    let m = d.getMonth()+1
    m = m < 10 ? '0' + m : m.toString()
    let a = d.getDate()
    a = a < 10 ? '0' + a : a.toString()
    let h = d.getHours()
    h = h < 10 ? '0' + h : h.toString()
    let u = d.getMinutes()
    u = u < 10 ? '0' + u : u.toString()
    let ext = (file.mimetype.indexOf('png') > 0) ? 'png' : 'jpg'

    const fName = d.getFullYear() + m + a + h + u + '.' + ext
    cb(null, req.body.cid + '_' + fName)
  }
})
//const upload = multer({dest: './upload/'});
const upload = multer({ storage: storage });
const router = express.Router()

router.post('/upload', upload.single('photoUploader'), (req, res, next) => {
  if (!req.file) return res.status(400).send('No File')

  res.send(req.file.filename)
})


module.exports = router