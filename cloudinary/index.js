const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//retrieve information from .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET

});

//create new cloudinary storage and specify details
const storage = new CloudinaryStorage({
    cloudinary,
    params :{
        folder: "Yelp Camp",
        allowedFormats: ["jpeg", "png", "jpg"]
    }
});

module.exports = {cloudinary, storage}