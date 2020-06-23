var Codecamp = require("../models/codecamp");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCodecampOwnership = function (req, res, next) {
    // check if user is logged in
    if (req.isAuthenticated()) {
        Codecamp.findById(req.params.id, function (err, foundCodecamp) {
            if (err) {
                req.flash("error", "Code camp not found");
                res.redirect("back");
            } else {
                // check if user own the codecamp (codecamp created by user)
                if (foundCodecamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied. You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // check if user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // check if user own the comment (comment created by user)
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied. You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;