const Utils = require('./controller/postCtrl.js')

exports.AcessarPost = (req, res) => {
    Utils.AcessarPost(req.params.id, (resul) => {
        res.json(resul)
    })
}

exports.Publicar = (req, res) => {
    Utils.Publicar(req, (retorno) => {
        res.json(retorno)
    })
}