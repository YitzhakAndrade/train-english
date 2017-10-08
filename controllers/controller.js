module.exports = function (Objeto) {
	return {
		getAll: function(req, res) {
			Objeto.find(function(err, obj) {
				if (err) {
					res.send({err : err})
				} else {
					res.json(obj)
				}
			})
		},

		postOne: function(req, res) {

			var obj = new Objeto(req.body);

			obj.save(function(err) {
				if (err) {
					res.send({ err: err, message: 'Ocorreu um erro ao tentar salvar o objeto.' })
					// console.log(err);
				} else {
					res.send({ success: true, message: 'Objeto adicionado.', id: obj._id, objeto: obj })
				}
			});
		},

		getOne: function(req, res) {
			Objeto.findOne({ _id:req.params.id }, function(err, obj) {
				if (err) {
					res.send(err)
				} else {
					res.json(obj)
				}
			});
		},

		putOne: function(req, res) {
			Objeto.findOne({ _id:req.params.id },function(err, obj) {

				if (err) {
					res.send(err)
					return
				}

				for (var prop in req.body) {
					obj[prop]=req.body[prop]
				}

				obj.save(function(err) {
					if (err){
						res.send(err)
						return
					}

					res.json({ success: true, message: 'Objeto atualizado.', objeto: obj })
				})

			})
		},

		deleteOne: function(req, res) {
			Objeto.remove({ _id: req.params.id }, function(err, obj) {
				if (err){
					res.send(err)
					return
				}

				res.json({ message: 'Objeto deletado com sucesso.' })
			});
		},
	}
}