const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

// Create a storage configuration that tells multer:
// "Instead of saving files locally, send them to Cloudinary"
const storage = new CloudinaryStorage({

  // Pass your configured cloudinary instance
  // (this contains your cloud name, API key, secret)
  cloudinary: cloudinary,

  // params = settings for how files should be stored in Cloudinary
  params: {
    // 📁 Folder name in your Cloudinary dashboard
    // All uploaded images will go inside this folder
    folder: 'wanderly_DEV',

    // 🖼️ Format of the uploaded file
    // No matter what user uploads (jpg, jpeg, etc.)
    // it will be converted into 'png'
    allowedFormats: ["png","jpg","jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage
}