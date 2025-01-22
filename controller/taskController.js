const { validationResult } = require("express-validator");
const Task = require("../model/taskModel");
var createError = require("http-errors");

exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const taskName = req.body.taskName.trim();
    const description = req.body.description.trim();

    const task = new Task({ taskName: taskName, description: description });
    const result = await task.save(); // saving to mongoDB
    if (result) {
      return res.status(200).json({
        message: "Task created successfully",
        task: result,
      });
    } else {
      return next(createError(500, "failed to create the task"));
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json({
      tasks: tasks,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = req.body.taskId;
    if (!taskId) {
      return next(createError.NotFound("Task id not provided"));
    }
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return next(createError.NotFound("No task found"));
    }
    await Task.deleteOne({ _id: taskId });
    return res.status(200).json({
      message: "task removed successfully",
      status: true,
      taskId: taskId,
    });
  } catch (error) {
    return next(createError.InternalServerError());
  }
};
exports.updateTaskStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const taskId = req.body.taskId;
    const status = req.body.status;
    if (!taskId) {
      return next(createError.NotFound("Task id not provided"));
    }
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return next(createError.NotFound("No task found"));
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { $set: { status: status } },
      { new: true }
    );
    console.log("updatedTask", updatedTask);
    return res.status(200).json({
      message: "task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log("error", error);
    return next(createError.InternalServerError());
  }
};
