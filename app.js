
const express        = require('express'),
      PORT           = process.env.PORT || 2000,
      app            = express(),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose'),
      flash          = require('connect-flash'),
      passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      methodOverride = require('method-override'),
      Campground     = require('./models/campgrounds'),
      Comment        = require('./models/comments'),
      User           = require('./models/users'),
      seedDB         = require('./seeds')

// Requiring Routes
const commentRoutes      = require('./routes/comments'),
      campgroundRoutes   = require('./routes/campgrounds'),
      indexRoutes        = require('./routes/index')

// const url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp_v2'
// mongoose.connect(url)
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v2', { useNewUrlParser: true,useUnifiedTopology: true });
mongoose.connect('mongodb+srv://farhanxavio:sighin00@cluster0-yeozg.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(() => {
    console.log('connected to db')
}).catch(err => {
    console.log('Error found!!!!!!!!!!!:',err.message)
})

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static(__dirname+'/public'))
app.use(methodOverride('_method'))
app.use(flash())
// seedDB()

//Passport Configuration
app.use(require('express-session')({
    secret:"Once again Rusty wins",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//global send items
app.use((req,res,next) => {
    res.locals.currentUser = req.user
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
})

//use Routes
app.use('/',indexRoutes)
app.use('/campgrounds/:id/comments',commentRoutes)
app.use('/campgrounds',campgroundRoutes)

//Server Listening
app.listen(PORT,() => {
    console.log('YelpCamp server started listening to PORT 2000')
})
