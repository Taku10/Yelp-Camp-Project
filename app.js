//require npm packages
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet")
const ejsMate = require("ejs-mate")
const {campgroundSchema, reviewSchema} = require("./schemas.js")
const Campground = require("./models/campground");
const methodOverride = require("method-override")
const mongoose = require("mongoose");
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review.js");
const campgroundRouter = require("./routers/campground")
const reviewRouter = require("./routers/review")
const userRouter = require("./routers/user")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const MongoStore = require('connect-mongo')
const mongoSanitize = require('express-mongo-sanitize');
// 'mongodb://localhost:27017/yelp-camp'
const localPassport =require("passport-local")
const User = require("./models/user")
const mongoCloud = process.env.MONGO_ATLAS || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(mongoCloud, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.set('useCreateIndex', true);
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () =>{
    console.log("Database connected");
});


// Middleware 
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(mongoSanitize());
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/takundam/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


const secret = process.env.SECRET || "thisshouldbeasecret!"

const store = MongoStore.create({
    mongoUrl: mongoCloud,
    secret,
    touchAfter: 24 * 60 * 60,
})
 store.on("error", function(e){
     console.log("Store error!!!")
 })

//session and flash config
const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7,
        
    }
}

app.use(session(sessionConfig))
app.use(flash())

//passport config
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPassport(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
    
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    next();
})


//home route
app.get("/", (req, res) =>{

    res.render("campgrounds/home")
})

app.use("/campgrounds", campgroundRouter)

app.use("/campgrounds/:id/reviews", reviewRouter)

app.use("/", userRouter)







app.all("*", (req, res, next) =>{
    next( new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) =>{
    const { statusCode = 500} = err;
    if(!err.message) err.message = "Oh no!! Something went wrong" 
    res.status(statusCode).render("error", {err});
})



app.listen(3000, function(){
    console.log("Server has started");
})