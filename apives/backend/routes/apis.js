const router = require('express').Router();
const mongoose = require('mongoose');
const ApiListing = require('../models/ApiListing');
const verify = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ CREATE API (Protected)
router.post('/create', verify, async (req, res) => {
  try {
    const apiData = req.body;
    let imageUrls = [];

    // Upload gallery images (base64 -> cloudinary url)
    if (Array.isArray(apiData.gallery) && apiData.gallery.length > 0) {
      const uploadPromises = apiData.gallery.map(async (img) => {
        if (typeof img === 'string' && img.startsWith('http')) return img;

        const result = await cloudinary.uploader.upload(img, {
          folder: 'apives_gallery',
        });
        return result.secure_url;
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    const newApi = new ApiListing({
      ...apiData,
      gallery: imageUrls,
      imageUrl: imageUrls[0] || apiData.imageUrl || '',
      providerId: req.user.id, // ✅ link to logged-in provider
      status: apiData.status || 'active',
    });

    const savedApi = await newApi.save();
    return res.status(200).json(savedApi);
  } catch (err) {
    console.error('❌ CREATE API Error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// ✅ GET MY APIS (Protected) - Provider Dashboard
router.get('/mine', verify, async (req, res) => {
  try {
    const apis = await ApiListing.find({ providerId: req.user.id }).sort({ createdAt: -1 });
    return res.json(apis);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL APIS (Public) - Home/Directory pages
// default: only active
router.get('/', async (req, res) => {
  try {
    const includePaused = req.query.includePaused === 'true';
    const filter = includePaused ? {} : { status: 'active' };

    const apis = await ApiListing.find(filter).sort({ createdAt: -1 });
    return res.json(apis);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', verify, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid API id' });
    }

    const api = await ApiListing.findById(id);
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    if (api.providerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ApiListing.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ✅ GET ONE API BY ID (Public) - Keep this LAST
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid API id' });
    }

    const api = await ApiListing.findById(id);
    if (!api) return res.status(404).json({ message: 'API not found' });

    return res.json(api);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;