// src/models/LostFound.js
const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    status: { 
      type: String, 
      enum: ['lost', 'found'], 
      required: true 
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostFound', lostFoundSchema);
