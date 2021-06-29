const express = require("express")
const router = express.Router()
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn, isAuth, validateCampground} = require("../middleware")
const campground = require("../controller/campground")
const multer = require("multer")
const {storage}= require("../cloudinary")
const upload = multer({ storage})

//Render form
router.get("/new", isLoggedIn, campground.renderNewForm)

//view Campground and post campground
router.route("/")
    .get(campground.index)
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campground.createNew))
   


 

//show, update and delete campground
router.route("/:id")
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn,  isAuth, upload.array("image"), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuth, catchAsync(campground.deleteCampground))



//edit campground
router.get("/:id/edit", isLoggedIn, isAuth, catchAsync(campground.renderEditForm))


module.exports = router;