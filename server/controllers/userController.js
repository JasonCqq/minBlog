const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");

exports.create_user = [
  body("full_name").trim().escape(),
  body("username").trim().escape(),
  body("password", "Password must be between 8-20 characters")
    .trim()
    .isLength({ min: 8, max: 20 })
    .escape(),
  body("confirmPassword", "Passwords do not match")
    .trim()
    .isLength({ min: 8, max: 20 })
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .escape(),
  body("email").trim().isEmail().escape(),

  asyncHandler(async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array().map((error) => error.msg) });
    } else {
      const user = new User({
        full_name: req.body.full_name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      });
      await user.save();
      res.redirect(`/user/${user._id}`);
    }
  }),
];

exports.view_user = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).exec();
  res.json({
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    blogs: user.blogs,
  });
});
