//MIDDLEWARE FILES

var middlewareObj = {};
var Comment = require("../models/comment");
var Campground = require("../models/campground");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                req.campground = foundCampground;
                next();
            }
            else {
                //do they own campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                res.redirect("back");
            } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                req.Comment = foundComment;
                next();
            }
            else {
                //do they own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.isAdmin = function(req, res, next){
    if(req.user.Admin){
        next();
    } else {
        req.flash('error', 'This site is now read only due to spamming');
        res.redirect('back');
    }
};

module.exports = middlewareObj;