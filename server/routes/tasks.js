const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

// Task CRUD
router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getTasks); // pagination & filters
router.get('/:id', auth, taskController.getTaskById);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

// Extra routes for status & priority updates
router.patch('/:id/status', auth, taskController.updateTaskStatus);
router.patch('/:id/priority', auth, taskController.updateTaskPriority);

module.exports = router;
