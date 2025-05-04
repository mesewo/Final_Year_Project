const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "duwzuflcq",
  api_key: "441942542794491",
  api_secret: "jNs42nobXfPp0_taAgTk",
});

// Use memory storage to store the file temporarily
const storage = multer.memoryStorage();

// Image upload function
async function imageUploadUtil(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto", // Automatically determine the type (image, video, etc.)
    });
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
