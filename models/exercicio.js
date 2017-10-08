var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	tipo: {
		type: String,
		required: true
	},
	pergunta: {
		type: String,
		required: true
	},
	resposta: {
		type: String,
		required: true
	},
	vocabulo: {
		type: Schema.Types.ObjectId,
		ref: 'vocabulo',
		required: true
	},
});

module.exports = mongoose.model('exercicio', schema);