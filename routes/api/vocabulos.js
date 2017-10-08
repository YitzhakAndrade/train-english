var express = require('express')
var router = express.Router()

var vocabulosCtrl = require('../../controllers/vocabulos.js')
var genericRouter = require('./router.js')

router = genericRouter(vocabulosCtrl)

module.exports = router