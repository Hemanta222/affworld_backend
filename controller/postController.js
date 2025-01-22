const { validationResult } = require("express-validator");
const Post = require("../model/postModel");
var createError = require("http-errors");

exports.addPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const caption = req.body.caption?.trim();
    const content = req.body.content?.trim() || "";
    const post = new Post({
      caption: caption,
      content: content,
      user: req.userId,
      imageURL: req?.file?.path || "",
    });
    const result = await post.save(); // saving to mongoDB
    if (result) {
      return res.status(200).json({
        message: "Post added successfully",
        post: result,
      });
    } else {
      return next(createError(500, "failed to create the task"));
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
exports.getPosts = async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = req.body.page ? parseInt(req.body.page) : 1; // Default to page 1 if not provided
    const skip = page > 0 ? pageSize * (page - 1) : 0; // Skip 0 for page 1, 10 for page 2, etc.

    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip) // Skip calculated documents
      .limit(pageSize); // Limit to pageSize results
    return res.status(200).json({
      posts: posts,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
