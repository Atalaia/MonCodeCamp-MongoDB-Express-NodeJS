var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Codecamp = require("./models/codecamp");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

mongoose.connect("YOUR-MONGODB-CONNECTION-STRING", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX - Show all code camps
app.get("/codecamps", function (req, res) {
    Codecamp.find({}, function (err, allCodecamps) {
        if (err) {
            console.log(err);
        } else {
            res.render("codecamps/index", { codecamps: allCodecamps });
        }
    });
});

// CREATE - add new code camp to database
app.post("/codecamps", function (req, res) {
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
app.get("/codecamps/new", function (req, res) {
    res.render("codecamps/new.ejs");
});

// SHOW - shows more info about one code camp
app.get("/codecamps/:id", function (req, res) {
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

// ====================
// COMMENTS ROUTES
// ====================

app.get("/codecamps/:id/comments/new", function (req, res) {
    // find code camp by id
    Codecamp.findById(req.params.id, function (err, codecamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { codecamp: codecamp });
        }
    });
});

app.post("/codecamps/:id/comments", function(req, res) {
    //lookup code camp using ID
    Codecamp.findById(req.params.id, function(err, codecamp) {
        if(err) {
            console.log(err);
            res.redirect("/codecamps");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    codecamp.comments.push(comment);
                    codecamp.save();
                    res.redirect("/codecamps/" + codecamp._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to code camp
    //redirect code camp show page
});

app.listen(process.env.PORT || '3000', process.env.IP, function () {
    console.log("The MonCodeCamp Server Has Started!");
});