const express = require("express")
const router = express.Router({mergeParams: true})
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const {isLoggedIn, validateReview, isReviewAuth} = require("../middleware")
const review = require("../controller/review")



router.post("/" , isLoggedIn, validateReview, catchAsync(review.createReview))

router.delete("/:revId",isReviewAuth, isLoggedIn, catchAsync(review.deleteReview))

module.exports = router;