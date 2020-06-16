var express = require("express");
var router = express.Router({ mergeParams: true });
var Codecamp = require("../models/codecamp");
var Comment = require("../models/comment");

// ====================
// COMMENTS ROUTES
// ====================

// Comments NEW - show form to create new comment
router.get("/new", isLoggedIn, function (req, res) {
    // find code camp by id
    Codecamp.findById(req.params.id, function (err, codecamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { codecamp: codecamp });
        }
    });
});

// Comments CREATE - add new comment to database
router.post("/", isLoggedIn, function (req, res) {
    //lookup code camp using ID
    Codecamp.findById(req.params.id, function (err, codecamp) {
        if (err) {
            console.log(err);
            res.redirect("/codecamps");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    console.log("New comment's username will be: " + req.user.username);
                    // save comment 
                    comment.save();
                    codecamp.comments.push(comment);
                    codecamp.save();
                    console.log(comment);
                    res.redirect("/codecamps/" + codecamp._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to code camp
    //redirect code camp show page
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;