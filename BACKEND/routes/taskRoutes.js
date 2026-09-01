const express = require("express");

const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTrash,
  restoreTask,
  permanentDeleteTask,
} = require("../controllers/taskController");

const Authorization = require("../middleware/Authorization");

// =========================
// AUTHENTICATION
// =========================

router.use(Authorization);

// =========================
// NORMAL TASK CRUD
// =========================

router.post("/", createTask);

router.get("/", getAllTasks);

// =========================
// TRASH
// IMPORTANT: These routes
// must come before /:id
// =========================

router.get("/trash/all", getTrash);

router.patch("/trash/:id/restore", restoreTask);

router.delete("/trash/:id/permanent", permanentDeleteTask);

// =========================
// SINGLE TASK ROUTES
// =========================

router.get("/:id", getTaskById);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

module.exports = router;
