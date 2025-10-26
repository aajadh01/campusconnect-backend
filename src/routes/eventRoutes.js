const express = require("express")
const router = express.Router()
const upload = require("../utils/multer")
const {
  createEvent,
  getAllEvents,
  registerEvent,
  deleteEvent,
  closeRegistration, // Added closeRegistration import
} = require("../controllers/eventController")
const { protect } = require("../middleware/auth")

router.use(protect)

router.post("/create", upload.single("image"), createEvent)
router.get("/", getAllEvents)
router.put("/:id/register", registerEvent)
router.put("/:id/close-registration", closeRegistration) // Added close registration route
router.delete("/:id", deleteEvent)

module.exports = router
