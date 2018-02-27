const Post = require('./post/post.js')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
})

const upload = multer({
  storage: storage
})

module.exports = (app) => {
  app.get('/post', Post.AcessarPost)
  app.post('/post', upload.single('imagem'), Post.Publicar)

  app.get('*', function (req, res) {
    res.sendfile('./public/index.html')
  })

  app.use(function (req, res, next) { // allow cross origin requests
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS, DELETE, GET')
    res.header('Access-Control-Allow-Origin', 'http://localhost')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
}
