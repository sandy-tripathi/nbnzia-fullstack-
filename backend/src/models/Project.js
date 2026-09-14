const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    href: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^https?:\/\/.+/i.test(v),
        message: "href must be a valid absolute URL",
      },
    },
    imageUrl: { type: String, required: true, trim: true },
    bg: { type: String, default: "#1f1f1f", trim: true },
    textDark: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ProjectSchema.index({ order: 1 });

module.exports = mongoose.model("Project", ProjectSchema);
