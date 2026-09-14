const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validateBody, projectSchema, projectUpdateSchema } = require('../validators/schemas');

const router = express.Router();

// Public
router.get('/', getProjects);

// Admin-only from here down
router.post('/', protect, validateBody(projectSchema), createProject);
router.get('/:id', protect, getProject);
router.put('/:id', protect, validateBody(projectUpdateSchema), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
