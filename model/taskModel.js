const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskName: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "Pending" },
});

taskSchema.set("timestamps", true);
taskSchema.set("toObject", { getters: true });
const Task = mongoose.model("tasks", taskSchema);
module.exports = Task;
