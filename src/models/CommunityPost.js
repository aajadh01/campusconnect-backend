// src/models/CommunityPost.js
const mongoose = require("mongoose")

const communityPostSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String, required: true },
    category: { type: String },
    imageUrl: { type: String },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    posterName: String,
    posterRole: String,
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: String,
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    type: {
      type: String,
      enum: ["post", "announcement"],
      default: "post",
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("CommunityPost", communityPostSchema)
