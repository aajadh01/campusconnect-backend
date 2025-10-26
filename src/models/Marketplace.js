// src/models/Marketplace.js
const mongoose = require("mongoose")

const marketplaceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    contact: { type: String, required: true },
    imageUrl: { type: String }, // Cloudinary URL
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploaderName: String,
    uploaderRole: String,
    sold: { type: Boolean, default: false },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Marketplace", marketplaceSchema)
