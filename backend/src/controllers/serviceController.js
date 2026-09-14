const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Service = require('../models/Service');

const getServices = asyncHandler(async (req, res) => {
  const filter = req.admin ? {} : { published: true };
  const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: services });
});

const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, data: service });
});

const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, data: service });
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, message: 'Service deleted' });
});

module.exports = { getServices, getService, createService, updateService, deleteService };
