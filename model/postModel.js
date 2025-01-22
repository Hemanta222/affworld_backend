const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  content: { type: String },
  caption: { type: String, required: true },
  imageURL: { type: String, default: "" },
});

postSchema.set("timestamps", true);
postSchema.set("toObject", { getters: true });
const Post = mongoose.model("posts", postSchema);
module.exports = Post;
