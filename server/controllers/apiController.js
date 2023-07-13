const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

exports.get_recent_posts = asyncHandler(async (req, res) => {
  const count = req.params.count;

  const docCount = await Post.countDocuments({});

  const posts = await Post.find({ published: true })
    .limit(parseInt(count))
    .sort({ timestamp: -1 })
    .populate({ path: "author_id", select: "username -_id" })
    .exec();
  return res.json({ posts: posts, docCount: docCount });
});

// Get blogs with query.
exports.get_blogs = asyncHandler(async (req, res) => {
  const page = req.query.p || 0;
  const query = req.query.query || null;
  let queryBy = req.query.queryBy || null;
  let sortBy = req.query.sortBy || null;
  let sortOrder = req.query.sortOrder || null;

  const blogsPerPage = 9;
  let blogPipeline = [];

  // If query exists, push match
  if (query !== null) {
    if (queryBy === "author") {
      queryBy = "author_id";
    } else if (queryBy === "tag") {
      queryBy = "category";
    }

    blogPipeline.push({
      $match: { [queryBy]: { $regex: query, $options: "i" } },
    });
  }

  // If sort exists, push sort
  if (sortBy !== null) {
    if (sortBy === "author") {
      sortBy = "author_id";
    } else if (sortBy === "tag") {
      sortBy = "category";
    }
    sortOrder === "asc" ? (sortOrder = 1) : (sortOrder = -1);

    blogPipeline.push({ $sort: { [sortBy]: sortOrder } });
  }

  // Count after querying, Find username and add to results.
  blogPipeline.push({
    $facet: {
      count: [{ $count: "count" }],
      blogs: [
        { $skip: page * blogsPerPage },
        { $limit: blogsPerPage },
        {
          $lookup: {
            from: "users",
            localField: "author_id",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            _id: 1,
            title: 1,
            text: 1,
            category: 1,
            author_id: 1,
            published: 1,
            timestamp: 1,
            "author.username": 1,
          },
        },
      ],
    },
  });

  let blogs;
  try {
    blogs = await Post.aggregate(blogPipeline).exec();
  } catch (err) {
    console.error(err);
  }

  return res.json({ blogs: blogs[0].blogs, docCount: blogs[0].count[0].count });
});

// Get comments on specific post
exports.get_comments = asyncHandler(async (req, res) => {
  const post = req.params.id;
  const comments = await Comment.find({ blog_id: [post] })
    .sort({ timestamp: 1 })
    .populate({ path: "user", select: "username _id" })
    .exec();

  return res.json({ comments: comments });
});
