// src/controllers/resourceController.js
const asyncHandler = require("express-async-handler")
const Resource = require("../models/Resource")

// 📤 Upload a new resource/note
exports.uploadResource = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error("File is required")
  }

  const { title, subject, description, branch, semester } = req.body

  if (!title) {
    res.status(400)
    throw new Error("Title is required")
  }

  const resource = await Resource.create({
    title,
    subject,
    description,
    branch,
    semester,
    fileUrl: req.file.path, // Cloudinary URL
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    uploadedBy: req.user._id,
    uploaderName: req.user.fullName,
    uploaderRole: req.user.role,
    status: "pending",
  })

  res.status(201).json({
    message: "Resource uploaded successfully",
    resource,
  })
})

// 📚 Get all resources
exports.getAllResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find()
    .select("+uploaderRole") // Explicitly include uploaderRole
    .populate("uploadedBy", "fullName registeredId role")
    .sort({ createdAt: -1 })

  const resourcesWithRole = resources.map((resource) => {
    const resourceObj = resource.toObject()
    if (!resourceObj.uploaderRole && resourceObj.uploadedBy) {
      resourceObj.uploaderRole = resourceObj.uploadedBy.role
    }
    resourceObj.upvotes = resource.upvotes.length
    resourceObj.uploadedAt = resourceObj.createdAt
    return resourceObj
  })

  res.json({ count: resourcesWithRole.length, resources: resourcesWithRole })
})

// 👍 Upvote a resource
exports.upvoteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
  if (!resource) {
    res.status(404)
    throw new Error("Resource not found")
  }

  if (resource.upvotes.includes(req.user._id)) {
    resource.upvotes.pull(req.user._id)
  } else {
    resource.upvotes.push(req.user._id)
  }

  await resource.save()
  res.json({ message: "Upvote updated", upvotes: resource.upvotes.length })
})

// 🗑️ Delete own resource
exports.deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
  if (!resource) {
    res.status(404)
    throw new Error("Resource not found")
  }

  if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to delete this resource")
  }

  await resource.deleteOne()
  res.json({ message: "Resource deleted successfully" })
})

// ✅ Faculty verify resource
exports.verifyResource = asyncHandler(async (req, res) => {
  if (req.user.role !== "faculty" && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Only faculty or admin can verify resources")
  }

  const resource = await Resource.findById(req.params.id)
  if (!resource) {
    res.status(404)
    throw new Error("Resource not found")
  }

  resource.verified = true
  resource.status = "approved"
  await resource.save()

  res.json({ message: "Resource verified successfully" })
})

exports.trackDownload = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
  if (!resource) {
    res.status(404)
    throw new Error("Resource not found")
  }

  resource.downloads = (resource.downloads || 0) + 1
  await resource.save()

  res.json({ message: "Download tracked", downloads: resource.downloads })
})
