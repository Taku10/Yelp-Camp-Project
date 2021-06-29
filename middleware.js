const Campground = require("./models/campground");
const {campgroundSchema, reviewSchema} = require("./schemas.js")
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review")

module.exports.isLoggedIn = async(req, res, next)=>{
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in!!");
        return res.redirect("/login")
    }
    next();
}

module.exports.isAuth = async(req, res, next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You aren't Authorized to do that!!!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req, res, next) =>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuth = async(req, res, next)=>{
    const {id, revId} = req.params
    const review = await Review.findById(revId)
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You aren't Authorized to do that!!!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}