const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const port = process.env.PORT || 8088

app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.static(__dirname + '/public'))

const apiRoutes = express.Router()
require('./app/routes')(app, apiRoutes)

app.listen(port)
console.log('Magic happens on port ' + port)
exports = module.exports = app
