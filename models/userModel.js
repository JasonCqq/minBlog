const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  full_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, minLength: 8, maxLength: 50, required: true },
  email: { type: String, required: true },
  blogs: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  bookmarks: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  drafts: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

module.exports = mongoose.model("User", UserSchema);
