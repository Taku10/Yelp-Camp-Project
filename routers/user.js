const express = require("express")
const router = express.Router({mergeParams: true})
// const {userSchema} = require("../schemas.js")
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const User = require("../models/user");
const passport = require("passport")
const user = require("../controller/user")

router.route("/register")
    .get(user.registerForm)
    .post(catchAsync(user.register))

router.route("/login")
    .get(user.loginForm)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), user.login)

router.get("/logout", user.logout)

module.exports = router;
