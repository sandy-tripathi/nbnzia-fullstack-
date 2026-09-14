const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { validateBody, serviceSchema, serviceUpdateSchema } = require('../validators/schemas');

const router = express.Router();

router.get('/', getServices);

router.post('/', protect, validateBody(serviceSchema), createService);
router.get('/:id', protect, getService);
router.put('/:id', protect, validateBody(serviceUpdateSchema), updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
