var express = require("express");
var router = express.Router();
const user_controller = require("../controllers/userController");

router.get("/create", function (req, res) {
  res.json({ message: "Test" });
});

router.post("/create", user_controller.create_user);

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ success: true, user: req.session.user });
  } else {
    res.send({ success: false });
  }
});
router.post("/login", user_controller.login_user);

router.post("/logout", user_controller.logout_user);

//user_controller.create_user
router.get("/:id", user_controller.view_user);

module.exports = router;
