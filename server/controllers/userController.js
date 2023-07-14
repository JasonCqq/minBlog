const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

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
      res.json({ errors: "Invalid Gmail" });
    } else {
      // Check if Email/Username exists already
      const userCheck = await User.find({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });
      if (userCheck.length !== 0) {
        return res.json({ success: false, error: "User already exists" });
      } else if (userCheck.length === 0) {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({
              error: "Error hashing password",
              // Send back old data.
              oldData: {
                full_name: req.body.full_name,
                username: req.body.username,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword,
                email: req.body.email,
              },
            });
          }

          // Save user to Database
          const user = new User({
            full_name: req.body.full_name,
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
          });
          await user.save();

          // Log user in after creation
          const userData = {
            id: user._id,
            username: user.username,
            bookmarks: user.bookmarks,
          };
          req.session.user = userData;

          return res.json({ success: true, user: req.session.user });
        });
      }
    }
  }),
];

exports.view_user = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).exec();
  // Retrieve user's blogs
  let posts = await Post.find({
    author_id: { $in: id },
  })
    .sort({ timestamp: -1 })
    .populate({ path: "author_id", select: "username _id" })
    .exec();

  if (posts.length === 0) {
    posts = [];
  }
  // Retrive user's bookmarks
  const bookmarks = await Post.find({ _id: { $in: user.bookmarks } })
    .populate({ path: "author_id", select: "username _id" })
    .exec();

  return res.json({
    id: user._id,
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    blogs: posts,
    bookmarks: bookmarks,
  });
});

exports.login_user = [
  // Sanitize
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

      // Save user to session
      const userData = {
        id: user._id,
        username: user.username,
        bookmarks: user.bookmarks,
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

exports.add_bookmark = asyncHandler(async (req) => {
  const post = req.params.id;
  const user = req.session.user;

  await User.findByIdAndUpdate(user.id, { $push: { bookmarks: post } }).exec();
});

exports.delete_bookmark = asyncHandler(async (req) => {
  const post = req.params.id;
  const user = req.session.user;

  await User.findByIdAndUpdate(user.id, { $pull: { bookmarks: post } }).exec();
});
