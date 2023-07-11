const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");

exports.get_recent_posts = asyncHandler(async (req, res) => {
  const count = req.params.count;

  const docCount = await Post.countDocuments({});

  const posts = await Post.find({ published: true }, "-_id")
    .limit(parseInt(count))
    .sort({ timestamp: -1 })
    .populate({ path: "author_id", select: "username -_id" })
    .exec();
  return res.json({ posts: posts, docCount: docCount });
});
