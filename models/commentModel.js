const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  blog_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  username: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model("Comment", CommentSchema);
