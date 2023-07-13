const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/commentModel");

// const CommentSchema = new Schema({
//     blog_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     text: { type: String, min: 3, max 50, required},
//     timestamp: { type: Date, required: true },
//   });

exports.create_comment = [
  // Sanitize
  body("text", "Comment must be 3-100 characters")
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body("user").trim().escape(),
  body("blog_id").trim().escape(),
  body("timestamp").trim().escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const comm = new Comment({
        blog_id: req.body.blog_id,
        user: req.body.user,
        text: req.body.text,
        timestamp: new Date(),
      });
      await comm.save();
      res.json({ success: true });
    }
  }),
];
