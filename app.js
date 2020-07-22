// configure dotenv
require('dotenv').config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require('method-override')
var Codecamp = require("./models/codecamp");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// requering routes
var indexRoutes = require("./routes/index");
var codecampsRoutes = require("./routes/codecamps");
var commentRoutes = require("./routes/comments");

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
//require moment
app.locals.moment = require('moment');

// seedDB(); // seed the database

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/codecamps", codecampsRoutes);
app.use("/codecamps/:id/comments", commentRoutes);

app.listen(process.env.PORT || '3000', process.env.IP, function () {
    console.log("The MonCodeCamp Server Has Started!");
});