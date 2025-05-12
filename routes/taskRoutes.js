const express = require("express");
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/addtask',taskController.addTask);
router.get('/gettask',taskController.getAllTaskByUserId);
router.get('/gettask/:id',taskController.getTaskByTaskId);
router.put('/update/:id',taskController.updateTaskByUserId);
router.delete('/delete/:id',taskController.deleteTaskByUserId);

module.exports = router;