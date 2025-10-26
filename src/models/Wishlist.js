// src/models/Wishlist.js
const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Wishlist", wishlistSchema)
