const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');
const { validateUser, validateProject, validateTask } = require('../middleware/validation');

// Auth routes
router.post('/auth/register', validateUser, authController.register);
router.post('/auth/login', authController.login);

// Protected routes
router.use(authenticateToken);

// User routes
router.get('/auth/profile', authController.getProfile);
router.put('/auth/profile', authController.updateProfile);

// Project routes
router.post('/projects', validateProject, projectController.createProject);
router.get('/projects', projectController.getProjects);
router.get('/projects/:id', projectController.getProject);
router.put('/projects/:id', validateProject, projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Task routes
router.post('/tasks', validateTask, taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get('/tasks/stats', taskController.getTaskStats);
router.get('/tasks/:id', taskController.getTask);
router.put('/tasks/:id', validateTask, taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
