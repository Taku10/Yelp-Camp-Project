const Campground = require("../models/campground")
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const campground = require("../models/campground");

const mapboxToken = process.env.MAPBOX_TOKEN;

 const geocoder = mbxGeocoding({accessToken: mapboxToken})




module.exports.index = async (req, res) =>{
    const campgrounds = await Campground.find({})

    res.render("campgrounds/index", {campgrounds})
}

module.exports.renderNewForm  = (req, res) =>{
    res.render("campgrounds/new")
}

module.exports.createNew = async (req, res, next) =>{

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campgrounds = await new Campground(req.body.campground);
    campgrounds.geometry = geoData.body.features[0].geometry;
    campgrounds.images = req.files.map(f => ({url: f.path, filename: f.filename}));

    campgrounds.author = req.user._id
    console.log(campgrounds)
    campgrounds.save()
    req.flash("success", "Successfully created a campground!!")

    res.redirect(`/campgrounds/${campgrounds._id}`)
    

}

module.exports.showCampground = async (req, res) => {
    
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path:"reviews", populate: {path: "author"}}).populate("author")
    if(!campground){
        req.flash("error", "Couldn't find campground")
        res.redirect("/campgrounds")
    }

    res.render("campgrounds/show", {campground})
}

module.exports.renderEditForm = async (req, res) =>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error", "Couldn't find campground")
        res.redirect("/campgrounds")
    }
    
    res.render("campgrounds/edit", {campground})
}

module.exports.updateCampground = async (req, res) =>{
    const {id} = req.params
    const body = req.body.campground
    const campground = await Campground.findByIdAndUpdate(id, {...body}, {new: true, runValidators: true})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
   
    req.flash("success", "Updated Campground!")
    res.redirect("/campgrounds")
}

module.exports.deleteCampground = async (req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id)
    req.flash("success", "Deleted Campground!")
    res.redirect("/campgrounds")
}