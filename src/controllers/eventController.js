const asyncHandler = require("express-async-handler")
const Event = require("../models/Event")

// 🟢 Create event (Organizer/Admin)
exports.createEvent = asyncHandler(async (req, res) => {
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Only organizers or admins can create events")
  }

  if (!req.file) {
    res.status(400)
    throw new Error("Event image is required")
  }

  const { title, description, date, venue, formLink } = req.body

  if (!title || !date) {
    res.status(400)
    throw new Error("Title and date are required")
  }

  const event = await Event.create({
    title,
    description,
    date,
    venue,
    formLink, // Added formLink to event creation
    imageUrl: req.file.path,
    createdBy: req.user._id,
    organizerName: req.user.fullName,
    organizerRole: req.user.role,
  })

  res.status(201).json({ message: "Event created", event })
})

// 🟡 Get all events
exports.getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate("createdBy", "fullName registeredId role").sort({ date: 1 })

  res.json({ count: events.length, events })
})

// 🔵 Register for event
exports.registerEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  if (!event.registeredUsers.includes(req.user._id)) {
    event.registeredUsers.push(req.user._id)
    await event.save()
  }

  res.json({ message: "Registered successfully", event })
})

exports.closeRegistration = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to close registration for this event")
  }

  event.registrationClosed = true
  await event.save()

  res.json({ message: "Registration closed successfully", event })
})

// 🔴 Delete event (Organizer/Admin only)
exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to delete this event")
  }

  await event.deleteOne()
  res.json({ message: "Event deleted successfully" })
})
