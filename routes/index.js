var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function (req, res) {
    res.render("landing");
});

// ====================
// AUTH ROUTES
// ====================

// Show register form
router.get("/register", function (req, res) {
    res.render("register");
});

// Handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register", { "error": err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to MyCodingBootcamp " + user.username);
            res.redirect("/codecamps");
        });
    });
});

// Show login form
router.get("/login", function (req, res) {
    res.render("login");
});

// handling login logic
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/codecamps",
        failureRedirect: "/login"
    }), function (req, res) {
    });

// add logout route logic
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You have logged out successfully!");
    res.redirect("/codecamps");
});

module.exports = router;