const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, minLength: 3, maxLength: 50, required: true },
  text: { type: String, minLength: 50, maxLength: 1500, required: true },
  category: { type: String, required: true },
  author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, required: true },
});

module.exports = mongoose.model("Post", PostSchema);
