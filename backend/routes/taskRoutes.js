const express = require("express");
const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", protect, async (req, res) => {
  const { title, description, status, priority, project, assignedTo } = req.body;

  try {
    // Create the task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      project,
      assignedTo,
      createdBy: req.user.id,
    });

    // Add the task reference to the project's 'tasks' array
    await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Tasks (Optionally Filter by Project)
router.get("/", protect, async (req, res) => {
  const { projectId } = req.query;  // Optional query param to filter tasks by project

  try {
    let tasks;
    if (projectId) {
      // Fetch tasks only for a specific project
      tasks = await Task.find({ assignedTo: req.user.id, project: projectId });
    } else {
      // Fetch all tasks for the user
      tasks = await Task.find({ assignedTo  : req.user.id });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Task
router.put("/:id", protect, async (req, res) => {
  try {
    // Update task based on the ID
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the task reference from the project's tasks array
    await Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } });

    // Delete the task
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
