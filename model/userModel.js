const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true, minlength: 6 },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //ensure hash password only at the time of creation and at the time of modifying the password
    //but not modify the password when updating different field
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.set("timestamps", true);
userSchema.set("toObject", { getters: true });
const User = mongoose.model("users", userSchema);
module.exports = User;
