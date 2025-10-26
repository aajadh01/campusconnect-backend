const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    venue: { type: String },
    imageUrl: { type: String }, // Cloudinary URL
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizerName: String,
    organizerRole: String,
    formLink: { type: String }, // Google Form or registration form link
    registrationClosed: { type: Boolean, default: false },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Event", eventSchema)
