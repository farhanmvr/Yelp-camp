var express = require('express')
var router  = express.Router()
var Campground = require('../models/campgrounds')
var middleware = require('../middleware') //it automatically detect index.js

// INDEX - show all campgrounds
router.get('/',(req,res) => {
    Campground.find({},(err,allCampgrounds) => {
        if(err){
            console.log(err)
        }else{
            res.render('campgrounds/index',{campgrounds:allCampgrounds})
        }
    })
})

// CREATE - add new campground to db
router.post('/',middleware.isLoggedIn,(req,res) => {
    //get data from form and add to the array
    var name = req.body.name
    var price = req.body.price
    var image = req.body.image
    var desc = req.body.desc
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name,price:price,image:image,desc:desc,author:author}

    Campground.create(newCampground,(err,campground) =>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/campgrounds')
        }
    })
})

// NEW - show form to create new campground
router.get('/new',middleware.isLoggedIn,(req,res) => {
    res.render('campgrounds/new')
})

// SHOW - show more info about a campground
router.get('/:id',async (req,res) => {
    //find campground with provided id
    try{
        let foundCampground = await Campground.findById(req.params.id).populate('comments').exec()
        res.render('campgrounds/show',{campground:foundCampground})
    }catch(err){
        req.flash('error','Error occured')
        res.redirect('back')
    }
})

//Edit campground rout
router.get('/:id/edit',middleware.checkCampgroundOwnership,(req,res) => {
    Campground.findById(req.params.id,(err,foundCampground) => {
        if(!err){
            res.render('campgrounds/edit',{campground:foundCampground})
        }else{
            req.flash('error','Something went wrong, please try again later..')
            res.redirect('back')
        }
    })
})

// Update campground rout
router.put('/:id',middleware.checkCampgroundOwnership,(req,res) => {
    //find and update campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground) => {
        if(err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds/'+ req.params.id)
        }
    })
})

//Destroy campground route
router.delete('/:id',middleware.checkCampgroundOwnership,(req,res) => {
    Campground.findByIdAndRemove(req.params.id,(err) => {
        if(err){
            console.log(err)
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds')
        }
    })
})



module.exports = router