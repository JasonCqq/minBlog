var express = require("express");
var router = express.Router();
const user_controller = require("../controllers/userController");

router.get("/create", function (req, res) {
  res.json({ message: "Test" });
});

router.post("/create", user_controller.create_user);

//user_controller.create_user
router.get("/:id", user_controller.view_user);

module.exports = router;
