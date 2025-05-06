import cloudinary from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

cloudinary.v2.config({
  cloud_name: "dpguil2cm",     // Your Cloudinary cloud name
  api_key: "631937375588527", // Your Cloudinary API key
  api_secret: "sGaPh8_IhhkpQ67ps5ubK4xFzzc", // Your Cloudinary API secret
});

const storage = multer.memoryStorage();

export const imageUploadUtil = async (fileBufferOrArrayBuffer) => {
  try {
    const buffer = Buffer.isBuffer(fileBufferOrArrayBuffer)
      ? fileBufferOrArrayBuffer
      : Buffer.from(fileBufferOrArrayBuffer);

    const timestamp = Math.floor(Date.now() / 1000); // Generate timestamp

    // Generate the signature using Cloudinary's utility function
    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp: timestamp },
      cloudinary.v2.config().api_secret
    );

    console.log("String to Sign (Server - Implicit):", `timestamp=${timestamp}`);
    console.log("Generated Signature (Server - SDK):", signature);

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: "auto",
            timestamp: timestamp, // Include timestamp
            signature: signature, // Include generated signature
            api_key: cloudinary.v2.config().api_key, // Include the api_key
          },
          (error, result) => {
            if (result) resolve(result);
            else {
              console.error("Cloudinary error response:", error?.response?.data); // Log more details
              reject(error);
            }
          }
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });

    return await streamUpload();
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

export const upload = multer({ storage });