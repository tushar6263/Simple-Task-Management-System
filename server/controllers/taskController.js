const Task = require('../models/Task');
const mongoose = require('mongoose');


exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title required' });

    const task = new Task({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'medium',
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err.message);
    res.status(500).send('Server error');
  }
};

exports.getTasks = async (req, res) => {
  try {
    let { page = 1, limit = 10, status, priority, assignedTo } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('assignedTo', 'name email');

    res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Get Tasks Error:", err.message);
    res.status(500).send('Server error');
  }
};


exports.getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: 'Invalid Task ID' });

    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(task);
  } catch (err) {
    console.error("Get Task By ID Error:", err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: 'Invalid Task ID' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { title, description, dueDate, priority, status, assignedTo } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Update Task Error:", err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: 'Invalid Task ID' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (task.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: 'Not authorized' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error("Delete Task Error:", err.message);
    res.status(500).send('Server error');
  }
};


exports.updateTaskStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: 'Invalid Task ID' });

    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] },
      { status },
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error("Update Task Status Error:", err.message);
    res.status(500).send('Server error');
  }
};


exports.updateTaskPriority = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ msg: 'Invalid Task ID' });

    const { priority } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] },
      { priority },
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error("Update Task Priority Error:", err.message);
    res.status(500).send('Server error');
  }
};
