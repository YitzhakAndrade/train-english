//=========================================
// Carregar os módulos
//=========================================

var express     = require('express'),
	mongoose    = require('mongoose'),
	morgan      = require('morgan'),
	bodyParser  = require('body-parser'),	
	cors        = require('cors')/*,	
	passport    = require('passport')*/

//=========================================
// Configurar o servidor express
//=========================================

var app = express()

// get our request parameters
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// log to console
app.use(morgan('dev'))

//=========================================
// Passport: usado para autenticação
//=========================================
/*
// Use the passport package in our application
app.use(passport.initialize());

// pass passport for configuration
var configpass = require('./config/passport');
configpass(passport);
*/
//=========================================
// Carregar as rotas
//=========================================

var rota_bots_apiai = require('./routes/bots/api-ai.js')

var rota_api_vocabulo = require('./routes/api/vocabulos.js')
var rota_api_exercicio = require('./routes/api/exercicios.js')

//=========================================
// Conexão com o banco de dados
//=========================================

// get db config file
var config_db = require('./config/db')

// Conecta ao banco de dados
mongoose.connect(config_db, { useMongoClient: true })

//=========================================
// Conectar rotas
//=========================================

app.get('/', function(req, res) {
	res.send("I'm your teacher!")
})

app.use('/bots/api-ai', rota_bots_apiai)

app.use('/api/vocabulos', rota_api_vocabulo)
app.use('/api/exercicios', rota_api_exercicio)

//=========================================
// Exportar o modulo
//=========================================

module.exports = app