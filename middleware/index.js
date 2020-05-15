var Campground = require('../models/campgrounds')
var Comment    = require('../models/comments')

//all Middleware goes here
middlewareObj = {}

middlewareObj.checkCampgroundOwnership = (req,res,next) => {
    // is logged in and does own the campground
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err,foundCampground) => {
            if(err || !foundCampground){
                req.flash('error','Something went wrong, please try again later..')
                res.redirect('back')
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next()
                }else{
                    req.flash('error','Something went wrong, please try again later..')
                    res.redirect('back')
                }
            }
        })
    }else{
        req.flash('error','You need to Login')
        res.redirect('back')
    }
    
}

middlewareObj.checkCommentOwnership = (req,res,next) => {
    // is logged in and does own the comment
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,(err,foundComment) => {
            if(err || !foundComment){
                req.flash('error','Something went wrong, please try again later..')
                res.redirect('back')
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next()
                }else{
                    req.flash('error','Something went wrong, please try again later..')
                    res.redirect('back')
                }
            }
        })
    }else{
        req.flash('error','You need to Login')
        res.redirect('back')
    }
}

middlewareObj.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error','Please Login first!')
    res.redirect('/login')
}

module.exports = middlewareObj