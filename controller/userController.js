const { validationResult } = require("express-validator");
const { generateToken } = require("../helper/jwtHelper");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
var createError = require("http-errors");
const { default: axios } = require("axios");
const { default: mongoose, Types } = require("mongoose");
const JWT_SECRET = process.env.TOKEN_KEY;

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password.toString();
    const name = req.body.name.trim();
    const isEmailExists = await User.findOne({ email: email });
    if (isEmailExists) {
      return next(createError(400, "User already exists"));
    }
    const user = new User({ email: email, password: password, name: name });
    const result = await user.save(); // saving to mongoDB
    if (result) {
      const accessToken = await generateToken(result._id);

      return res.status(200).json({
        message: "Sign up successfully",
        id: result._id,
        email: result.email,
        token: accessToken,
      });
    } else {
      return next(createError(500, "Registration failed!"));
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: errors.array()[0].msg, status: false });
  }

  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password.toString();

    const findUser = await User.findOne({ email: email });
    if (findUser) {
      const comparePassword = await findUser.isValidPassword(password); // user model method

      //if(comparePassword id false means wrong password
      if (!comparePassword) return next(createError.Unauthorized());

      const accessToken = await generateToken(findUser._id);

      if (accessToken) {
        return res.status(200).json({
          message: "Sign in successfully",
          id: findUser._id,
          email: email,
          token: accessToken,
        });
      }
      return res.status(400).json({ message: "login failed", status: false });
    } else {
      return next(createError.Unauthorized());
    }
  } catch (error) {
    return next(createError.InternalServerError());
  }
};

// function to password reset requests
exports.forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: errors.array()[0].msg, status: false });
  }
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email: email });

    if (!user) {
      return next(createError.NotFound("User not found"));
    }
    const token = await generateToken(user._id);
    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const data = {
      service_id: process.env.EMAIL_JS_SERVICE_ID,
      template_id: process.env.EMAIL_JS_TEMPLATE_ID,
      user_id: process.env.EMAIL_JS_PUBLIC_KEY,
      accessToken: process.env.EMAIL_JS_PRIVATE_KEY,
      template_params: {
        email: email,
        user_email: email,
        link: link,
      },
    };
    console.log("data", data);
    const emailResponse = await axios({
      method: "POST",
      url: process.env.EMAILJS_SEND_API_URL,
      data: data,
      headers: { "Content-Type": "application/json" },
    });
    console.log("emailResponse", emailResponse);
    return res
      .status(200)
      .json({ message: "Password reset email sent", status: true });
  } catch (error) {
    console.log("------------error", error);
    return next(createError(500, error.message));
  }
};

// function to password reset (using the token)
exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: errors.array()[0].msg, status: false });
  }

  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Find the user by ID (replace with your actual database logic)
    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      return next(createError.NotFound("User not found!"));
    }
    console.log("user", user);
    user.password = newPassword;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("error", error);
    if (error.name === "TokenExpiredError") {
      return next(createError.BadRequest("Token expired"));
    }
    return next(createError.InternalServerError("Error resetting password"));
  }
};
