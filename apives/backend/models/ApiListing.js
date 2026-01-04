const mongoose = require('mongoose');

const apiListingSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  provider: { type: String },
  description: { type: String },
  category: { type: String },
  pricing: {
    type: { type: String },
    details: String,
    currency: { type: String, default: 'INR' },
    pricePerCall: Number
  },
  imageUrl: String,
  gallery: [String], // Array of Base64 strings
  features: [String],
  tags: [String],
  externalUrl: String,
  
  // Endpoints Structure
  endpoints: [{
    method: String,
    path: String,
    description: String,
    body: mongoose.Schema.Types.Mixed,
    responseExample: mongoose.Schema.Types.Mixed
  }],

  // Metadata
  upvotes: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  latency: String,
  stability: String,
  accessType: String,
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('ApiListing', apiListingSchema);