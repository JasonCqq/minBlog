const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  blog_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, minLength: 3, maxLength: 100 },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model("Comment", CommentSchema);
