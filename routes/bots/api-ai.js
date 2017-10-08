var jsonQuery = require('json-query')
var express = require('express')

var vocabuloModel = require('../../models/vocabulo.js')

var router = express.Router()

router.route('/').post(apiaiPost)

module.exports = router

var actions = {
	traduzir: actionTraduzir,
	exemplo: actionExemplo,
	aprenderPalavra: actionAprenderPalavra,
}

function apiaiPost (req, res) {
	
	console.log('\n\n\n\n===============================================\n\n')
	console.log(JSON.stringify(req.body))
	console.log('\n\n===============================================\n\n\n\n')

	var result = req.body.result
	var action = actions[result.action]
	if (action) {
		action(res, result)
	}
	else {
		responder(res, 'Ação não encontrada.')
	}

}

function telegram_keyboard() {
	return {
		reply_markup: {
			keyboard: [
				[{ text: 'E qual é a tradução?' }],
				[{ text: 'Me dê um exemplo' }],
				[{ text: 'Quero um exercício' }],
			],
			one_time_keyboard: true,
			resize_keyboard: true,
		}
	}
}

function telegram_inlineKeyboard() {
	return {
		reply_markup: {
			inline_keyboard: [
				[{ text: 'Tradução', callback_data: 'E qual é a tradução?' }],
				[{ text: 'Exemplo', callback_data: 'Me dê um exemplo' }],
				[{ text: 'Exercício', callback_data: 'Quero um exercício' }],
			],
		}
	}
}

function telegram_removeKeyboard() {
	return {
		reply_markup: {
			remove_keyboard: true,
		}
	}
}

function telegram_fn(data, response, telegram) {
	if (telegram) {
		telegram.text = response
		data.telegram = telegram		
	}
	return data
}

function responder(res, response, telegram, contextOut) {
	var data = {}
	data = telegram_fn(data, response, telegram)

	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify({ 
		speech: response, 
		displayText: response,
		data: data,
		contextOut: contextOut,
	}))
}

function actionTraduzir(res, result) {
	var vocabulo = jsonQuery('[name=vocabulo]', { data: result.contexts }).value.parameters.vocabulo

	vocabuloModel.findOne({ 
		$or: [
			{ palavra: vocabulo },
			{ expressao: vocabulo },
		] 
	}, function(err, obj) {
		var response = ''
		var telegram = telegram_removeKeyboard()
		if (err) {
			console.log(err)
			response = 'Ocorreu um erro no servidor.'
		} else if (obj) {
			response = "A tradução de '" + (obj.palavra || obj.expressao) + "' é '" + obj.traducao + "'"
			telegram = telegram_inlineKeyboard()
		} else {
			response = 'Palavra ou expressão não cadastrada.'
		}
		responder(res, response, telegram)
	})
}

function actionExemplo(res, result) {
	var vocabulo = jsonQuery('[name=vocabulo]', { data: result.contexts }).value.parameters.vocabulo

	vocabuloModel.findOne({ 
		$or: [
			{ palavra: vocabulo },
			{ expressao: vocabulo },
		] 
	}, function(err, obj) {
		var response = ''
		var telegram = telegram_removeKeyboard()
		if (err) {
			console.log(err)
			response = 'Ocorreu um erro no servidor.'
		} else if (obj) {
			if (obj.exemplos && obj.exemplos.length > 0)
				response = "Exemplo: " + obj.exemplos[randomNumber(obj.exemplos.length)]
			else
				response = 'Esta palavra ou expressão não possui exemplos cadastrados.'
			telegram = telegram_inlineKeyboard()
		} else {
			response = 'Palavra ou expressão não cadastrada.'
		}
		responder(res, response, telegram)
	})
}

function actionAprenderPalavra(res, result) {
	vocabuloModel.count().exec(function (err, count) {
		var random = Math.floor(Math.random() * count)
		vocabuloModel.findOne().skip(random).exec(function (err, obj) {

			var response = (obj.palavra || obj.expressao)
			var telegram = telegram_inlineKeyboard()

			var contextOut = [{ 
				name: 'vocabulo',
				lifespan: 5,
				parameters: {
					vocabulo: response
				},
			}]

			responder(res, response, telegram,contextOut)

		})
	})
}

function randomNumber(length) {
	return Math.floor((Math.random() * length) + 1) - 1
}