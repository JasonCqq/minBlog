const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { default: mongoose } = require("mongoose");

exports.create_user = [
  // Sanitize
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

  // Hash Password and Save User
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array().map((error) => error.msg) });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        const user = new User({
          full_name: req.body.full_name,
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
        });
        await user.save();
        res.redirect(`/user/${user._id}`);
      });
    }
  }),
];

exports.view_user = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).exec();
  let posts = await Post.find({
    author_id: { $in: id },
  })
    .sort({ timestamp: 1 })
    .exec();
  if (posts.length === 0) {
    posts = [];
  }

  return res.json({
    id: user._id,
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    blogs: posts,
  });
});

exports.login_user = [
  body("username").trim().escape(),
  body("password", "Password must be at least 8 characters")
    .trim()
    .isLength({ min: 8 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array().map((error) => error.msg) });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json({ success: false, message: info.message });
      }

      const userData = {
        id: user._id,
        username: user.username,
      };
      req.session.user = userData;
      return res.json({ success: true, user: req.session.user });
    })(req, res, next);
  },
];

exports.logout_user = asyncHandler(async (req, res) => {
  res.clearCookie("userID", {
    path: "/",
  });
  req.session.destroy();
  return res.json({ success: true });
});
