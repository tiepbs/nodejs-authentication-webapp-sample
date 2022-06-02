//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const md5 = require("md5");
const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY, encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});


app.post("/login", function(req, res) {
  const usernameEntered = req.body.username;
  const passwordEntered = req.body.password;
  User.findOne({
      email: usernameEntered
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          bcrypt.compare(passwordEntered, foundUser.password, function(err, result) {
            if (result) {
              res.render("secrets");
            }
          });
        }
      }
    });
  });





app.listen(3000, function() {
  console.log("The server is up and running on port 3000");
});
