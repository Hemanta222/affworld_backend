const express = require("express");
const body = require("express-validator").body;

const router = express.Router();
const postController = require("../controller/postController");
const { verifyAccessToken } = require("../helper/jwtHelper");
const { upload } = require("../helper/imageUpload");
router.post(
  "/create-post",
  verifyAccessToken,
  upload.single("image"),
  [
    body("caption", "Caption must be atleast 3 chracter long")
      .trim()
      .isLength({ min: 3 })
      .escape(),
  ],
  postController.addPost
);

router.get("/get-posts", verifyAccessToken, postController.getPosts);

exports.routes = router;
