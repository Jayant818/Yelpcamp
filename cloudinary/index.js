const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
	cloud_name: process.env
.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINAY_KEY,
	api_secret: process.env
.CLOUDINARY_SECRET
})
//You have to set the names in the same Formatter

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'YelpCamp',  
	    allowedFormats:['jpeg','png','jpg']
    }
})

module.exports = {
    storage,cloudinary
}
