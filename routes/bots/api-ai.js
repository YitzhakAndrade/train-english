var jsonQuery = require('json-query')
var express = require('express')

var vocabuloModel = require('../../models/vocabulo.js')

var router = express.Router()

router.route('/').post(apiaiPost)

module.exports = router

var actions = {
	traduzir: actionTraduzir,
	exemplo: actionExemplo
}

function apiaiPost (req, res) {
	console.log(req.body)
	console.log(req.body.result.contexts)

	var result = req.body.result
	var action = actions[result.action]
	if (action) {
		action(res, result)
	}
	else {
		responder(res, 'é isso aí !!')
	}

}

function responder(res, response) {
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({ 
		speech: response, 
		displayText: response,
		data: {
			telegram: {
				text: response,
				reply_markup: {
					/*inline_keyboard: [
						[{ text: 'Tradução de Cervo', callback_data: 'O que é deer?' }],
						[{ text: 'Tradução de Querido', callback_data: 'O que é dear?' }],
					]*/
					keyboard: [
						[{ text: 'Tradução de Cervo' }],
						[{ text: 'Tradução de Querido' }]
					]
				}
			}
		}
	}))
}

function actionTraduzir(res, result) {	
	//var vocabulo = result.parameters.vocabulo
	var vocabulo = jsonQuery('[name=vocabulo]', { data: result.contexts }).value.parameters.vocabulo

	vocabuloModel.findOne({ 
		$or: [
			{ palavra: vocabulo },
			{ expressao: vocabulo },
		] 
	}, function(err, obj) {
		var response = ''
		if (err) {
			console.log(err)
			response = 'Ocorreu um erro no servidor.'
		} else if (obj) {
			response = "A tradução de '" + (obj.palavra || obj.expressao) + "' é '" + obj.traducao + "'"
		} else {
			response = 'Palavra ou expressão não cadastrada.'
		}
		responder(res, response)
	})
}

function actionExemplo(res, result) {	
	//var vocabulo = result.parameters.vocabulo
	var vocabulo = jsonQuery('[name=vocabulo]', { data: result.contexts }).value.parameters.vocabulo

	vocabuloModel.findOne({ 
		$or: [
			{ palavra: vocabulo },
			{ expressao: vocabulo },
		] 
	}, function(err, obj) {
		var response = ''
		if (err) {
			console.log(err)
			response = 'Ocorreu um erro no servidor.'
		} else if (obj) {
			if (obj.exemplos && obj.exemplos.length > 0)
				response = "Exemplo: " + obj.exemplos[randomNumber(obj.exemplos.length)]
			else
				response = 'Esta palavra ou expressão não possui exemplos cadastrados.'
		} else {
			response = 'Palavra ou expressão não cadastrada.'
		}
		responder(res, response)
	})
}

function randomNumber(length) {
	return Math.floor((Math.random() * length) + 1) - 1
}