var express = require("express");
var router = express.Router();
var Codecamp = require("../models/codecamp");
var Comment = require("../models/comment");

// ====================
// CODE CAMPS ROUTES
// ====================

// INDEX - Show all code camps
router.get("/", function (req, res) {
    // Get all code camps from DB
    Codecamp.find({}, function (err, allCodecamps) {
        if (err) {
            console.log(err);
        } else {
            res.render("codecamps/index", { codecamps: allCodecamps });
        }
    });
});

// CREATE - add new code camp to database
router.post("/", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCodeCamp = { name: name, image: image, description: desc, author: author };
    // Create a new code camp and save to DB
    Codecamp.create(newCodeCamp, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log("NEWLY CREATED CODE CAMP: ");
            console.log(newlyCreated);
            res.redirect("/codecamps");
        }
    });
});

// NEW - show form to create new code camp
router.get("/new", isLoggedIn, function (req, res) {
    res.render("codecamps/new.ejs");
});

// SHOW - shows more info about one code camp
router.get("/:id", function (req, res) {
    // find the code camp with provided ID
    Codecamp.findById(req.params.id).populate("comments").exec(function (err, foundCodecamp) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCodecamp);
            // render show template with that code camp
            res.render("codecamps/show", { codecamp: foundCodecamp })
        }
    });
});

// Edit code camp route - form edit
router.get("/:id/edit", checkCodecampOwnership, function (req, res) {
    Codecamp.findById(req.params.id, function (err, foundCodecamp) {
        res.render("codecamps/edit", { codecamp: foundCodecamp });
    });
});

// Update code camp route
router.put("/:id", checkCodecampOwnership, function (req, res) {
    // find and update the correct code camp
    Codecamp.findByIdAndUpdate(req.params.id, req.body.codecamp, function (err, updatedCodecamp) {
        if (err) {
            res.redirect("/codecamps");
        } else {
            // redirect to show page
            res.redirect("/codecamps/" + req.params.id);
        }
    });
});

// Destroy code camp route
router.delete("/:id", checkCodecampOwnership, function (req, res) {
    Codecamp.findByIdAndRemove(req.params.id, function (err, codecampRemoved) {
        if (err) {
            console.log(err);
            res.redirect("/codecamps");
        }
        // delete any associated comments when deleting a code camp
        Comment.deleteMany({ _id: { $in: codecampRemoved.comments } }, function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect("/codecamps");
        });
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCodecampOwnership(req, res, next) {
    // check if user is logged in
    if (req.isAuthenticated()) {
        Codecamp.findById(req.params.id, function (err, foundCodecamp) {
            if (err) {
                res.redirect("back")
            } else {
                // check if user own the codecamp (codecamp created by user)
                if (foundCodecamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back")
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;