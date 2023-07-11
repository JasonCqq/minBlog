var express = require("express");
var router = express.Router();
const post_controller = require("../controllers/postController");

router.get("/", function (req, res) {
  res.send("respond with a resource");
});

router.get("/:id", post_controller.view_post);
router.post("/create", post_controller.create_post);
// router.delete("/:id");
// router.put("/:id");

module.exports = router;
