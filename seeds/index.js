
const Campground = require("../models/campground")
const cities = require("./cities")
const SAcities = require("./SAcities")
const {places, descriptors} = require("./seedHelpers")
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () =>{
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    
    for(let i= 0; i < 200;i++){
        const random12700 = Math.floor(Math.random() * 12700);
        const price = Math.floor(Math.random () * 200) + 100
        
       const c = new Campground({
            location: `${SAcities[random12700].City}, ${SAcities[random12700].ProvinceName}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [
              SAcities[random12700].Longitude,
              SAcities[random12700].Latitude,
            ]
          },

            images:[
                {
                  
                  url: 'https://res.cloudinary.com/takundam/image/upload/v1624300915/Yelp%20Camp/ipe5m7vahvlat5hbe4de.jpg',
                  filename: 'Yelp Camp/ipe5m7vahvlat5hbe4de'
                },
                {
                  
                  url: 'https://res.cloudinary.com/takundam/image/upload/v1624300930/Yelp%20Camp/fndthhpc6xb3skysceds.jpg',
                  filename: 'Yelp Camp/fndthhpc6xb3skysceds'
                }
              ],
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse, dolorum unde. Quo quia nulla alias ea necessitatibus magnam praesentium quisquam, dolor asperiores incidunt sit, quaerat ratione impedit illum harum omnis?",
            price,
            author: "60c7ab8c55066f381c179f19"
        })
            await c.save();
    }
    
}

seedDB()