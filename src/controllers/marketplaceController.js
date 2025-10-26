// src/controllers/marketplaceController.js
const asyncHandler = require("express-async-handler")
const Marketplace = require("../models/Marketplace")

// 📤 Upload new marketplace item
exports.uploadItem = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error("Image is required")
  }

  const { title, description, price, contact } = req.body

  if (!title || !price || !contact) {
    res.status(400)
    throw new Error("Title, price, and contact are required")
  }

  const item = await Marketplace.create({
    title,
    description,
    price,
    contact,
    imageUrl: req.file.path,
    uploadedBy: req.user._id,
    uploaderName: req.user.fullName,
    uploaderRole: req.user.role,
  })

  res.status(201).json({
    message: "Item uploaded successfully",
    item,
  })
})

// 📚 Get all marketplace items
exports.getAllItems = asyncHandler(async (req, res) => {
  const items = await Marketplace.find()
    .select("+uploaderRole")
    .populate("uploadedBy", "fullName registeredId role")
    .sort({ createdAt: -1 })

  const itemsWithRole = items.map((item) => {
    const itemObj = item.toObject()
    if (!itemObj.uploaderRole && itemObj.uploadedBy) {
      itemObj.uploaderRole = itemObj.uploadedBy.role
    }
    return itemObj
  })

  res.json({ count: itemsWithRole.length, items: itemsWithRole })
})

// 🗑️ Delete own item
exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Marketplace.findById(req.params.id)
  if (!item) {
    res.status(404)
    throw new Error("Item not found")
  }

  if (item.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to delete this item")
  }

  await item.deleteOne()
  res.json({ message: "Item deleted successfully" })
})

// 🛒 Mark item as sold
exports.markAsSold = asyncHandler(async (req, res) => {
  const item = await Marketplace.findById(req.params.id)
  if (!item) {
    res.status(404)
    throw new Error("Item not found")
  }

  if (item.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to update this item")
  }

  item.sold = true
  item.purchasedBy = req.body.purchasedBy || null
  await item.save()

  res.json({ message: "Item marked as sold", item })
})
