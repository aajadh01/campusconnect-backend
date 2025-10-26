// src/routes/marketplaceRoutes.js
const express = require("express")
const router = express.Router()
const upload = require("../utils/multer")
const { uploadItem, getAllItems, deleteItem, markAsSold } = require("../controllers/marketplaceController")
const { protect } = require("../middleware/auth")

// All marketplace routes require login
router.use(protect)

// Upload new item
router.post("/upload", upload.single("image"), uploadItem)

// Get all items
router.get("/", getAllItems)

router.put("/:id/sold", markAsSold)

// Delete item
router.delete("/:id", deleteItem)

module.exports = router
