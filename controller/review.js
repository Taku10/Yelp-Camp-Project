const Review = require("../models/review")
const Campground = require("../models/campground");

module.exports.createReview = async (req, res)=> {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
 
    await review.save();
    await campground.save();
    req.flash("success", "Added Review!")

    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req, res)=>{
    const {id, revId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: revId}})
    await Review.findByIdAndDelete(revId)
    req.flash("success", "Deleted Review!")
    res.redirect(`/campgrounds/${id}`)
}