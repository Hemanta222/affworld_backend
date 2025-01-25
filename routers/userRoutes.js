const express = require("express");
const body = require("express-validator").body;

const router = express.Router();
const userController = require("../controller/userController");
const { verifyAccessToken } = require("../helper/jwtHelper");

// API endpoint to create new user
router.post(
  "/api/register",
  [
    body("name", "Name must be atleast 3 chracter long")
      .trim()
      .isLength({ min: 3 })
      .escape(),
    body("email", "Invalid email address")
      .trim()
      .isEmail()
      .normalizeEmail()
      .escape(),
    body(
      "password",
      "Invalid Password: password must be atleast 6 characters long"
    )
      .trim()
      .isLength({
        min: 6,
      })
      .escape(),
  ],
  userController.register
);

// API endpoint to login
router.post(
  "/api/login",
  [
    body("email", "Invalid email address")
      .trim()
      .isEmail()
      .normalizeEmail()
      .escape(),
    body(
      "password",
      "Invalid Password: password must be atleast 6 characters long"
    )
      .trim()
      .isLength({
        min: 6,
      }),
  ],
  userController.login
);

// API endpoint to check authentication
router.get("/api/check-auth", verifyAccessToken, userController.checkAuth);

// API endpoint for password reset requests
router.post(
  "/api/forgot-password",
  [
    body("email", "Invalid email address")
      .trim()
      .isEmail()
      .normalizeEmail()
      .escape(),
  ],
  userController.forgotPassword
);

// API endpoint for password reset (using the token)
router.post(
  "/api/reset-password/:token",
  [
    body(
      "newPassword",
      "Invalid Password: password must be atleast 6 characters long"
    ).isLength({
      min: 6,
    }),
  ],
  userController.resetPassword
);
exports.routes = router;
