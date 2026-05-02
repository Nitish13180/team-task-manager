const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

// GET tasks (filter by project or assigned)
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.user.role !== 'admin') filter.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create task
router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Members can only update their assigned tasks
    if (req.user.role !== 'admin' && String(task.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE task (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET dashboard stats
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] };
    const now = new Date();
    const [total, todo, inProgress, done, overdue] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: 'todo' }),
      Task.countDocuments({ ...filter, status: 'in-progress' }),
      Task.countDocuments({ ...filter, status: 'done' }),
      Task.countDocuments({ ...filter, dueDate: { $lt: now }, status: { $ne: 'done' } })
    ]);
    res.json({ total, todo, inProgress, done, overdue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
