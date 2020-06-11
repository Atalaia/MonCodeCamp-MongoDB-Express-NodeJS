var mongoose = require("mongoose");
var Codecamp = require("./models/codecamp");
var Comment = require("./models/comment");

var data = [
    {
        name: "Wild Code School",
        image: "https://www.wildcodeschool.com/uploads/f0d8879d138aff87af97e2a079c6db8e.jpg-DSC00956-min.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Epitech",
        image: "https://pbs.twimg.com/media/DMlcA4qWkAAaqX5.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Le Wagon",
        image: "https://i.f1g.fr/media/eidos/805x453_crop/2017/06/05/XVM80e87590-4a8a-11e7-9fe8-035f9d604401.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB() {
    //Remove all codecamps
    Codecamp.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed codecamps!");
        Comment.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few codecamps
            data.forEach(function (seed) {
                Codecamp.create(seed, function (err, codecamp) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a codecamp");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function (err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    codecamp.comments.push(comment);
                                    codecamp.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;