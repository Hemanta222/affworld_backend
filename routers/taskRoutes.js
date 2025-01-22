const express = require("express");
const body = require("express-validator").body;

const router = express.Router();
const taskController = require("../controller/taskController");
router.post(
  "/create-task",
  [
    body("taskName", "Task name must be atleast 3 chracter long")
      .trim()
      .isLength({ min: 3 })
      .escape(),
  ],
  taskController.createTask
);

router.delete("/delete-task", taskController.deleteTask);

router.patch(
  "/update-task-status",
  [
    body(
      "status",
      "provide a valid status from ['Pending','Completed','Done']"
    ).isIn(["Pending", "Completed", "Done"]),
  ],
  taskController.updateTaskStatus
);

router.get("/get-tasks", taskController.getTasks);

exports.routes = router;
