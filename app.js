const express = require('express');
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const path = require("path")
const dotenv = require("dotenv");
const User = require("./server/Models/user");
const connectDB = require("./server/database/connection");


const app = express();

// ------------------------------------------------Dotenv PORT
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080

// ------------------------------------------------Database
connectDB();
// ------------------------------------------------Morgan
app.use(morgan("tiny"));



app.use(require("express-session")({
    secret: "Any normal Word",       //decode or encode session
    resave: false,
    saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded(
    { extended: true }
))
app.use(passport.initialize());
app.use(passport.session());


// ------------------------------------------------Path
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));



//=======================
//      R O U T E S
//=======================
app.use("/", require("./server/routes/router"));




//Listen On Server


app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`)
    }

});