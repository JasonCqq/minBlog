const asyncHandler = require("express-async-handler");
// const { check, validationResult } = require("express-validator");
const Post = require("../models/postModel");

exports.get_recent_posts = asyncHandler(async (req, res) => {
  const count = req.params.count;
  const posts = await Post.find({ published: true }, "-_id")
    .limit(parseInt(count))
    .sort({ timestamp: -1 })
    .populate({ path: "author_id", select: "username -_id" })
    .exec();

  await posts.forEach((post) => {
    post.author_id = post.author_id.username;
  });

  res.json(posts);
});
