var express = require('express')
var router = express.Router()

var exerciciosCtrl = require('../../controllers/exercicios.js')
var genericRouter = require('./router.js')

router = genericRouter(exerciciosCtrl)

module.exports = router