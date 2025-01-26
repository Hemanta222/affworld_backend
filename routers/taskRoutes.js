const express = require("express");
const body = require("express-validator").body;

const router = express.Router();
const taskController = require("../controller/taskController");
const { verifyAccessToken } = require("../helper/jwtHelper");
router.post(
  "/create-task",
  verifyAccessToken,
  [
    body("taskName", "Task name must be atleast 3 chracter long")
      .trim()
      .isLength({ min: 3 })
      .escape(),
  ],
  taskController.createTask
);

router.delete("/delete-task", verifyAccessToken, taskController.deleteTask);

router.patch(
  "/update-task-status",
  verifyAccessToken,
  [
    body(
      "status",
      "provide a valid status from ['Pending','Completed','Done']"
    ).isIn(["Pending", "Completed", "Done"]),
  ],
  taskController.updateTaskStatus
);

router.get("/get-tasks", verifyAccessToken, taskController.getTasks);

exports.routes = router;
