var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("TEST");
  res.render("index", { title: "minBlog" });
});

module.exports = router;
