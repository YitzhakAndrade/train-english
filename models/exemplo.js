var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	palavra: {
		type: String
	},
	expressao: {
		type: String
	},
	traducao: {
		type: String,
		required: true
	},
	explicacao: {
		type: String
	},
});

module.exports = mongoose.model('exemplo', schema);