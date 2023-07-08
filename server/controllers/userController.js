const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/userModel");

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const user = new User({
        full_name: req.body.full_name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        blogs: {},
        bookmarks: {},
        drafts: {},
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
