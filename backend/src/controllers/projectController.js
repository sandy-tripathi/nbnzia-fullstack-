const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Project = require('../models/Project');

// GET /api/projects  (public — only published, sorted by `order`)
// GET /api/projects?all=true (admin — everything, for the dashboard)
const getProjects = asyncHandler(async (req, res) => {
  const filter = req.admin ? {} : { published: true };
  const projects = await Project.find(filter).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: projects });
});

// GET /api/projects/:id
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  res.json({ success: true, data: project });
});

// POST /api/projects (admin)
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// PUT /api/projects/:id (admin)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) throw new ApiError(404, 'Project not found');
  res.json({ success: true, data: project });
});

// DELETE /api/projects/:id (admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  res.json({ success: true, message: 'Project deleted' });
});

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
