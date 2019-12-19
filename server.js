const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const logger = require("morgan")

const app = express()

//body-parser middleware
app.use(express.static('./routes/public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logger('dev'))
//use view engine
app.set('view engine', 'ejs')

//passport middleware
app.use(passport.initialize())
//config for jwt strategy
require('./strategies/jsonJWTstrategy')(passport)

//setup server
var port = process.env.PORT || 80
app.listen(port, ()=>{
    console.log('Server is running at ' + port)
})
//setup database
const db = require('./key/databse').mongoURL
mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    console.log("Database is connected")
})
.catch((error)=>{
    console.log(error)
})

//bring all schollife routes
const publicRoute = require('./routes/api/public')
const auth = require('./routes/api/auth')
const questions = require('./routes/api/question')
const profile = require('./routes/api/profile')
// routes for schollife
app.use('/', publicRoute)
app.use('/api/auth', auth)
app.use('/api/questions', questions)
app.use('/api/profile', profile)

//research route
const allresearch = require('./routes/api/research/all')
const journal = require('./routes/api/research/journal')
const conference = require('./routes/api/research/conference')
const chapter = require('./routes/api/research/chapter')
const book = require('./routes/api/research/book')
const thesis = require('./routes/api/research/thesis')
const patent = require('./routes/api/research/patent')
const courtcase = require('./routes/api/research/courtcase')
app.use('/api/research', allresearch)
app.use('/api/research/journal',journal)
app.use('/api/research/conference',conference)
app.use('/api/research/chapter',chapter)
app.use('/api/research/book',book)
app.use('/api/research/thesis',thesis)
app.use('/api/research/patent',patent)
app.use('/api/research/courtcase',courtcase)

// //brings all resourceibrary route
// const rsAuth = require('./routes/api/resourceLibrary/auth')
// const rsPublicRoute = require('./routes/api/resourceLibrary/publicRoute')
// const rsVideoFile = require('./routes/api/resourceLibrary/videofile')
// const rsTxtFile = require('./routes/api/resourceLibrary/txtfile')

// //route for resourcelibrart
// app.use('/api/auth/schollife/resourcelibrary', rsAuth)
// app.use('/api/schollife/resourcelibrary',rsPublicRoute)
// app.use('/api/auth/schollife/resourcelibrary/videofile',rsVideoFile)
// app.use('/api/auth/schollife/resourcelibrary/txtfile',rsTxtFile)



app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error', err);
  });