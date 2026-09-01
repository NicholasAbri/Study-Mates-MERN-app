const Task = require("../models/taskModel");
const Activity = require("../models/activityModel");

// =========================
// CREATE
// =========================

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      user: req.user.id,
    });

    await Activity.create({
      user: req.user.id,
      task: newTask._id,
      taskTitle: newTask.title,
      action: "created",
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({
      message: "Error creating task",
      error: error.message,
    });
  }
};

// =========================
// GET ALL USER TASKS
// =========================

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// =========================
// GET ONE USER TASK
// =========================

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Task not found",
      error: error.message,
    });
  }
};

// =========================
// UPDATE
// =========================

exports.updateTask = async (req, res) => {
  try {
    const taskBeforeUpdate = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false,
    });

    if (!taskBeforeUpdate) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        isDeleted: false,
      },
      {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        completed: req.body.completed ?? taskBeforeUpdate.completed,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (
      req.body.completed !== undefined &&
      req.body.completed !== taskBeforeUpdate.completed
    ) {
      await Activity.create({
        user: req.user.id,
        task: updatedTask._id,
        taskTitle: updatedTask.title,
        action: updatedTask.completed ? "completed" : "uncompleted",
      });
    } else {
      await Activity.create({
        user: req.user.id,
        task: updatedTask._id,
        taskTitle: updatedTask.title,
        action: "edited",
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

// =========================
// SOFT DELETE → TRASH
// =========================

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.isDeleted = true;
    task.deletedAt = new Date();

    await task.save();

    await Activity.create({
      user: req.user.id,
      task: task._id,
      taskTitle: task.title,
      action: "deleted",
    });

    res.status(200).json({
      message: "Task moved to trash",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// =========================
// GET TRASH
// =========================

exports.getTrash = async (req, res) => {
  try {
    const deletedTasks = await Task.find({
      user: req.user.id,
      isDeleted: true,
    }).sort({
      deletedAt: -1,
    });

    res.status(200).json(deletedTasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching trash",
      error: error.message,
    });
  }
};

// =========================
// RESTORE
// =========================

exports.restoreTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: true,
    });

    if (!task) {
      return res.status(404).json({
        message: "Deleted task not found",
      });
    }

    task.isDeleted = false;
    task.deletedAt = null;

    await task.save();

    await Activity.create({
      user: req.user.id,
      task: task._id,
      taskTitle: task.title,
      action: "restored",
    });

    res.status(200).json({
      message: "Task restored successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error restoring task",
      error: error.message,
    });
  }
};

// =========================
// PERMANENT DELETE
// =========================

exports.permanentDeleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: true,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Deleted task not found",
      });
    }

    res.status(200).json({
      message: "Task permanently deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error permanently deleting task",
      error: error.message,
    });
  }
};
