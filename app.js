var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Codecamp = require("./models/codecamp");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

mongoose.connect("YOUR_MONGODB_CONNECTION_STRING", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Unicorns flying over rainbows",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function (req, res) {
    res.render("landing");
});

// ====================
// CODE CAMPS ROUTES
// ====================

// INDEX - Show all code camps
app.get("/codecamps", function (req, res) {
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

app.get("/codecamps/:id/comments/new", isLoggedIn, function (req, res) {
    // find code camp by id
    Codecamp.findById(req.params.id, function (err, codecamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { codecamp: codecamp });
        }
    });
});

app.post("/codecamps/:id/comments", isLoggedIn, function (req, res) {
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

// ====================
// AUTH ROUTES
// ====================

// Show register form
app.get("/register", function (req, res) {
    res.render("register");
});

// Handle sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/codecamps");
        });
    });
});

// Show login form
app.get("/login", function (req, res) {
    res.render("login");
});

// handling login logic
// app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/codecamps",
        failureRedirect: "/login"
    }), function (req, res) {
    });

// add logout route logic
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/codecamps");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT || '3000', process.env.IP, function () {
    console.log("The MonCodeCamp Server Has Started!");
});