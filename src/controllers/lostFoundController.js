// src/controllers/lostFoundController.js
const asyncHandler = require("express-async-handler")
const LostFound = require("../models/LostFound")

// 📤 Create new lost/found post
exports.createPost = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error("Image is required")
  }

  const { type, itemName, description, location, contact } = req.body

  if (!type || !itemName || !contact) {
    res.status(400)
    throw new Error("Type, item name, and contact are required")
  }

  const post = await LostFound.create({
    type,
    itemName,
    description,
    location,
    contact,
    imageUrl: req.file.path,
    postedBy: req.user._id,
    posterName: req.user.fullName,
    posterRole: req.user.role,
  })

  res.status(201).json({ message: "Post created", post })
})

// 📚 Get all posts
exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await LostFound.find().populate("postedBy", "fullName role registeredId").sort({ createdAt: -1 })

  const postsWithRole = posts.map((post) => {
    const postObj = post.toObject()
    if (!postObj.posterRole && postObj.postedBy) {
      postObj.posterRole = postObj.postedBy.role
    }
    return postObj
  })

  res.json({ count: postsWithRole.length, posts: postsWithRole })
})

// 🗑️ Delete own post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await LostFound.findById(req.params.id)
  if (!post) {
    res.status(404)
    throw new Error("Post not found")
  }

  if (post.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to delete this post")
  }

  await post.deleteOne()
  res.json({ message: "Post deleted successfully" })
})
