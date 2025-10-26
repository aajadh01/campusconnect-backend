// src/models/LostFound.js
const mongoose = require("mongoose")

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    itemName: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    contact: { type: String, required: true },
    imageUrl: { type: String },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    posterName: String,
    posterRole: String,
  },
  { timestamps: true },
)

module.exports = mongoose.model("LostFound", lostFoundSchema)
