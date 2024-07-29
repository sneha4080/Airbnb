const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// combin backend to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowFrdormat: ["jpg", "png", "jpng"] // this kind of file store 

    },
});

module.exports = {
    cloudinary,
    storage
}