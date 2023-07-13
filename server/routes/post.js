var express = require("express");
var router = express.Router();
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");

router.get("/:id", post_controller.view_post);
router.post("/create", post_controller.create_post);
// router.delete("/:id");
// router.put("/:id");

router.post("/comment", comment_controller.create_comment);
module.exports = router;
