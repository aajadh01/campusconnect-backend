const express = require("express")
const router = express.Router()
const upload = require("../utils/multer")
const {
  createPost,
  createAnnouncement,
  getAllPosts,
  replyToPost,
  votePost,
  deletePost,
} = require("../controllers/communityController")
const { protect } = require("../middleware/auth")

router.use(protect)

router.post("/create", upload.single("image"), createPost)
router.post("/announcement", createAnnouncement)
router.get("/", getAllPosts)
router.post("/:id/reply", replyToPost)

router.post("/:id/vote", votePost)
router.post("/:id/upvote", (req, res, next) => {
  req.body.action = "upvote"
  votePost(req, res, next)
})
router.post("/:id/downvote", (req, res, next) => {
  req.body.action = "downvote"
  votePost(req, res, next)
})

router.delete("/:id", deletePost)

module.exports = router
