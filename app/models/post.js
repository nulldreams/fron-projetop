var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
  titulo_original: String,
  titulo_url: String,
  descricao: String,
  tempo_leitura: String,
  data_publicacao: String
})

module.exports = mongoose.model('Usuario', postSchema)