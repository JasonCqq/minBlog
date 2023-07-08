const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../../models/userModel");

exports.create_user = asyncHandler(async (req, res) => {
  const user = new User({
    full_name: "Jason",
    username: "Jason2222",
    password: "12345678",
    email: "test@gmail.com",
    blogs: {},
    bookmarks: {},
    drafts: {},
  });
  await user.save();
});
