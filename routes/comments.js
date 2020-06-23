var express = require("express");
var router = express.Router({ mergeParams: true });
var Codecamp = require("../models/codecamp");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

// Comments NEW - show form to create new comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
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
router.post("/", middleware.isLoggedIn, function (req, res) {
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

// Comment Edit Route - Edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id , function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { codecamp_id: req.params.id, comment: foundComment });
        }
    })
});

// Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/codecamps/" + req.params.id);
        }
    });
});

// Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/codecamps/" + req.params.id);
        }
    });
});

module.exports = router;