const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const Resource = require("../models/Resource")

// ➕ Add a resource to wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
  const { resourceId } = req.body

  const resource = await Resource.findById(resourceId)
  if (!resource) {
    res.status(404)
    throw new Error("Resource not found")
  }

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  if (!user.wishlist.includes(resourceId)) {
    user.wishlist.push(resourceId)
    await user.save()
  }

  res.json({ message: "Added to wishlist", wishlist: user.wishlist })
})

// ➖ Remove a resource from wishlist
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const { resourceId } = req.body

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  user.wishlist.pull(resourceId)
  await user.save()

  res.json({ message: "Removed from wishlist", wishlist: user.wishlist })
})

// 📜 Get wishlist items - Return populated wishlist with full resource details
exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "wishlist",
    model: "Resource",
    select:
      "_id title subject description branch semester fileUrl fileName fileType uploadedBy uploaderName uploaderRole verified status upvotes downloads createdAt uploadedAt",
  })

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Return only the wishlist items (array of resources)
  res.json(user.wishlist || [])
})
