// server side
const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const apiRouter = require('./api')

// application server
const app = express()

// make assets the root directory， __dirname, current folder
const assetsFolder = path.resolve(__dirname, 'views/assets')
app.use(express.static(assetsFolder))

// ! important: to parse request JSON as req.body
// for bodyparser, handle json request, generate a body from the request
app.use(bodyParser.json({ type: 'application/json' }))


// template engine, dynamic, need to define views
// step 1. define path
const viewsFolder = path.resolve(__dirname, 'views')

// step 2. set engine
app.set("view engine", "ejs")

// step 3. render view
app.get('/', (req, res) => {
    res.render('home')
})

// for all methods
app.use('/api', apiRouter)

app.listen(8088)

console.log('App started on 8088...')