const express = require('express');
const Task = require('../models/taskModel');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create Task
router.post('/', protect, async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, user: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Tasks
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Task
router.put('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Task
router.delete('/:id', protect, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
