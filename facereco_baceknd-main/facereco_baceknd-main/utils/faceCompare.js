const axios = require("axios");
const sharp = require("sharp"); // Image processing library
require("dotenv").config();

// Convert Image URL to Base64 with Resizing
async function convertToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // ✅ Resize image if too large
    let resizedBuffer = buffer;
    if (buffer.length > 2_000_000) {
      console.log("🔄 Resizing image to reduce size...");
      resizedBuffer = await sharp(buffer)
        .resize(500, 500, { fit: "inside" }) // Keep aspect ratio
        .jpeg({ quality: 80 }) // Optimize quality
        .toBuffer();
    }

    // ✅ Convert resized image to Base64
    const base64String = resizedBuffer.toString("base64");

    // ✅ Check final size
    const sizeInBytes = Buffer.byteLength(base64String, "utf8");
    console.log(`✅ Final Base64 Size: ${(sizeInBytes / 1024).toFixed(2)} KB`);

    if (sizeInBytes > 2_000_000) {
      console.error("❌ Base64 image is still too large for Face++ API");
      return null;
    }

    return base64String;
  } catch (error) {
    console.error("❌ Error converting to Base64:", error.message);
    return null;
  }
}
// Compare Faces Function
const compareFaces = async (image1Url, image2Url) => {
  try {
    console.log("✅ API Key from env:", process.env.FACEPP_API_KEY);
    console.log("✅ API Secret from env:", process.env.FACEPP_API_SECRET);

    if (!process.env.FACEPP_API_KEY || !process.env.FACEPP_API_SECRET) {
      throw new Error("❌ API Key or Secret is missing in environment variables");
    }

    // Convert Image URLs to Base64
    const base64Image1 = await convertToBase64(image1Url);
    const base64Image2 = await convertToBase64(image2Url);

    if (!base64Image1 || !base64Image2) {
      console.error("❌ One or both images failed to convert");
      return false;
    }

    // Use `URLSearchParams` for API request
    const formData = new URLSearchParams();
    formData.append("api_key", process.env.FACEPP_API_KEY);
    formData.append("api_secret", process.env.FACEPP_API_SECRET);
    formData.append("image_base64_1", base64Image1);
    formData.append("image_base64_2", base64Image2);

    // ✅ Send request to Face++ API
    const response = await axios.post(
      "https://api-us.faceplusplus.com/facepp/v3/compare",
      formData.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log("✅ Face++ Response:", response.data);

    return response.data.confidence > 80; // Adjust confidence threshold if needed
  } catch (error) {
    console.error("❌ Face++ Error:", error.response?.data || error.message);
    if (error.response?.data) {
      console.error("❌ Face++ API Response:", JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
};

module.exports = compareFaces;
