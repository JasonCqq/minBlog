const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/postModel");

exports.view_post = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate({ path: "author_id", select: "username _id email" })
    .exec();

  res.json({
    id: post._id,
    title: post.title,
    text: post.text,
    category: post.category,
    author_id: post.author_id,
    timestamp: post.timestamp,
  });
});

exports.create_post = [
  // Sanitize
  body("title", "Title must be 3-50 characters")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body("text", "Post must be 50-1500 characters")
    .trim()
    .isLength({ min: 50, max: 1500 })
    .escape(),
  body("category").trim().escape(),
  body("author_id").trim().escape(),
  body("published").trim().escape(),
  body("timestamp").trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        category: req.body.category,
        author_id: req.body.author_id,
        published: req.body.published,
        timestamp: new Date(),
      });
      await post.save();
      return res.json({ success: true, id: post._id });
    }
  }),
];

exports.delete_post = asyncHandler(async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = req.session.user;
  const postId = req.params.postId;
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  if (user.id !== String(post.author_id)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await post.deleteOne();
  return res.status(200).json({ message: "Post deleted" });
});

// exports.update_post = asyncHandler(async(req,res)=>{

// })
