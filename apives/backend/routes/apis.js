const router = require('express').Router();
const ApiListing = require('../models/ApiListing');
const verify = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE API (Protected)
router.post('/create', verify, async (req, res) => {
  const saved = await new ApiListing({ ...req.body, providerId: req.user.id }).save();
  res.json(saved);
});

    // 1. Image Upload Logic (Base64 to Cloudinary URL)
    if (apiData.gallery && apiData.gallery.length > 0) {
      console.log("📤 Uploading images to Cloudinary...");
      
      // Promise.all use karenge taaki saari images parallel upload hon
      const uploadPromises = apiData.gallery.map(async (image) => {
        // Agar ye pehle se URL hai (edit case mein), toh aise hi rehne do
        if (image.startsWith('http')) return image;

        // Agar Base64 hai, toh upload karo
        const result = await cloudinary.uploader.upload(image, {
          folder: "apives_gallery",
        });
        return result.secure_url; // Ye hai wo URL jo humein chahiye!
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    // 2. Data Prepare karo with Image URLs
    const newApi = new ApiListing({
      ...apiData,
      gallery: imageUrls, // Ab yahan URLs hain, Base64 nahi
      imageUrl: imageUrls[0] || '', // Thumbnail bhi URL ban gaya
      providerId: req.user.id
    });

    // 3. Database mein Save karo
    const savedApi = await newApi.save();
    console.log("✅ API Saved with Image URLs!");
    
    res.status(200).json(savedApi);

  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET MY APIS (Protected) - only logged-in provider's APIs
router.get('/mine', verify, async (req, res) => {
  try {
    const apis = await ApiListing
      .find({ providerId: req.user.id })  // 👈 yahi main change hai
      .sort({ createdAt: -1 });

    res.json(apis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;