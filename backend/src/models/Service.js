const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    imageUrl: { type: String, required: true, trim: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
