var express = require('express')
var router  = express.Router({mergeParams:true})
var Campground = require('../models/campgrounds')
var Comment = require('../models/comments')
var middleware = require('../middleware') //it automatically detect index.js


//NEW COMMENTS
router.get('/new',middleware.isLoggedIn,async (req,res) => {
    try{
        let foundCampground = await Campground.findById(req.params.id)
        res.render('comments/new',{campground:foundCampground})
    }catch(err){
        console.log(err)
    }
})

//CREATE COMMENTS
router.post('/',middleware.isLoggedIn,async (req,res) => {
    try{
        let foundCampground = await Campground.findById(req.params.id)
        let comment = await Comment.create(req.body.comment)
        //add username and id to comment and save comment
        comment.author.id = req.user._id
        comment.author.username = req.user.username
        comment = await comment.save()
        await foundCampground.comments.push(comment)
        foundCampground = await foundCampground.save()
        req.flash('success','Successfully added comment')
        res.redirect('/campgrounds/'+req.params.id)
    }catch(err){
        req.flash('error','Something went wrong, please try again later..')
        res.redirect('/campgrounds')
    }
})
// Edit Comment form
router.get('/:comment_id/edit',middleware.checkCommentOwnership,async (req,res) => {
    try{
        var campground_id = req.params.id
        let comment = await Comment.findById(req.params.comment_id)
        res.render('comments/edit',{campground_id:campground_id,comment:comment})
    }catch(err){
        res.redirect('back')
    }
})
//update comment
router.put('/:comment_id',middleware.checkCommentOwnership,async (req,res) => {
    try{
       await Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment)
       req.flash('success','Updated your comment')
       res.redirect('/campgrounds/'+req.params.id)
    }catch(err){
        console.log(err)
        res.redirect('back')
    }
})

//Comment destroy Route
router.delete('/:comment_id',middleware.checkCommentOwnership,async (req,res) => {
    try{
        await Comment.findByIdAndRemove(req.params.comment_id)
        req.flash('success','Deleted comment')
        res.redirect('/campgrounds/'+req.params.id)
    }catch{
        res.redirect('back')
    }
})


module.exports = router