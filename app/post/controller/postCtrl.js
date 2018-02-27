const Post = require('../../models/post.js')
const moment = require('moment')
const knox = require('knox');
const client = knox.createClient({
    key: 'AKIAJUVEGFRFMWAMV4EQ',
    secret: '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',
    bucket: 'remember-files'
})

exports.AcessarPost = (id, callback) => {
    Post.findById(id, (err, post) => {
        if (typeof post !== 'undefined') {
            console.log(post)

            callback(post)
        }
    })
}

exports.Publicar = (req, callback) => {
    let titulo = req.body.titulo.replace(/[^\w\s]/gi, '').replace(/ /g, '-').toLowerCase()
    let nPub = new Post({
        titulo_original: req.body.titulo,
        titulo_url: titulo,
        imagem: '',
        descricao: req.body.legenda,
        corpo: req.body.corpo,
        data: moment().format('DD-MM-YYYY HH:mm:ss'),
        tempo_leitura: '1 min'
    })

    Postar(nPub, req, (sucesso) => {
        if (sucesso) return callback({ status: 200, result: 'ok.' })

        return callback({ status: 500, result: 'Ocorreu um erro.' })
    })
}

var Postar = (obj, req, callback) => {
    UploadAmazon(req.file, (url) => {
        obj.imagem = url

        obj.save((err, result) => {

            if (err) return callback(false)


            callback(true)
        })
    })
}


var UploadAmazon = (arquivo, callback) => {
    console.log('Arquivo', arquivo)
    client.putFile(arquivo.path, arquivo.filename, { 'x-amz-acl': 'public-read' }, (err, response) => {
        if (err) console.log('Erro', err)

        callback(response.req.url)
    })
}