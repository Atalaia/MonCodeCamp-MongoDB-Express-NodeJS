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

// requering routes
var indexRoutes = require("./routes/index");
var codecampsRoutes = require("./routes/codecamps");
var commentRoutes = require("./routes/comments");

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

app.use("/", indexRoutes);
app.use("/codecamps", codecampsRoutes);
app.use("/codecamps/:id/comments", commentRoutes);

app.listen(process.env.PORT || '3000', process.env.IP, function () {
    console.log("The MonCodeCamp Server Has Started!");
});