//============
//AUTH ROUTES
//============

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");

//Root Route
router.get("/", function(req, res){
    res.render("landing");
});

//Register Route
router.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    //admin logic
    if(req.body.adminCode === 'secretcode123'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    })
});

//Login Route
router.get("/login", function(req, res) {
   res.render("login"); 
});

//responsible for login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome to YelpCamp"
    }), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

// USERS PROFILES
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
      if(err){
          req.flash("error", "Something Went Wrong");
          res.redirect("/");
      }
      Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
        if(err){
            req.flash("error", "Something Went Wrong");
            res.redirect("/");
        }
        res.render("users/show", {user: foundUser, campgrounds: campgrounds}); 
      });
   });
});

module.exports = router;