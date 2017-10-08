var express = require('express')
var router = express.Router()

module.exports = function (ctrl) {
	router.route('/').get(ctrl.getAll)
	router.route('/').post(ctrl.postOne)

	router.route('/:id')
		.get(ctrl.getOne)
		.put(ctrl.putOne)
		.delete(ctrl.deleteOne)

	return router
}