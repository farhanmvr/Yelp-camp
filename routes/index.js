var express  = require('express')
var router   = express.Router()
var passport = require('passport')
var User     = require('../models/users')
var middleware = require('../middleware') //it automatically detect index.js


//Landing Page
router.get('/',(req,res) => {
    res.render('landing')
})



//show reg form
router.get('/register',(req,res) => {
    res.render('register')
})
//handle signup logic
router.post('/register',(req,res) => {
    var newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,(err,user) => {
        if(err){
            req.flash('error',err.message)
            return res.redirect("/register");
        }
        passport.authenticate('local')(req,res,() => {
            req.flash('success','Successfully Registered, Welcome '+user.username+' to YelpCamp')
            res.redirect('/campgrounds')
        })
    })
})

//Show login form
router.get('/login',(req,res) => {
    res.render('login')
})
//login logic
router.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}),(req,res) => {
})

//logout route
router.get('/logout',(req,res) => {
    req.logOut()
    req.flash('success','Logged you out!')
    res.redirect('/campgrounds')
})

module.exports = router