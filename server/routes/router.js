const express = require("express");
const route = express.Router();
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const Services = require("../services/render");
const User = require("../Models/user");

// --------------------------------------home
route.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("home");
    } else {
        res.redirect("/login")
    }
})
// --------------------------------------UserProfile
route.get("/userprofile", isLoggedIn, (req, res) => {
    if (req.isAuthenticated()) {
        res.render("userprofile");
    } else {
        res.redirect("/login")
    }

})
// --------------------------------------Login
route.get("/login", (req, res) => {
    res.render("login");
});

route.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function (req, res) {

});
// --------------------------------------Register
route.get("/register", (req, res) => {
    res.render("register");
});

route.post("/register", (req, res) => {

    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        })
    })
})
// -------------------------------------------------------------------------------------------------------------logout
route.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



// -------------------------------------------------------------------------------------------------------------





module.exports = route