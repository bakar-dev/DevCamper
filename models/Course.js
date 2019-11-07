const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course ttile"]
  },
  description: {
    type: String,
    required: [true, "Please add a course description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add course weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add tution cost"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a skill"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  sholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp"
  }
});

module.exports = mongoose.model("Course", CourseSchema);
