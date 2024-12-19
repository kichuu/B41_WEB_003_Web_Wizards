const express = require("express");
const Project = require("../models/projectModel");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Project
router.post("/", protect, async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = new Project({
      name,
      description,
      user: req.user.id,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    console.log(req.user.id)
    // Fetch all projects and populate the 'tasks' field for each
    const projects = await Project.find().populate("tasks");

    if (!projects) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.status(200).json(projects);  // Send all the projects with their tasks
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get Projects with Tasks
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("tasks");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
