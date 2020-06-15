var express = require("express");
var router = express.Router();
var Codecamp = require("../models/codecamp");

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
router.post("/", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCodeCamp = { name: name, image: image, description: desc };
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
router.get("/new", function (req, res) {
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

module.exports = router;