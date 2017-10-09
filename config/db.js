var dbhost = process.env.TRAIN_ENGLISH_DB_HOST
var dbport = process.env.TRAIN_ENGLISH_DB_PORT
var dbuser = process.env.TRAIN_ENGLISH_DB_USER
var dbpass = process.env.TRAIN_ENGLISH_DB_PASS
var dbname = 'train-english'

var db = 
	'mongodb://' + 
	dbuser + ':' + 
	dbpass + '@' + 
	dbhost + ':' + 
	dbport + '/' + 
	dbname

// local
//db = 'mongodb://localhost:27017/'

module.exports = db