const mongoose = require("mongoose");

const teachingAssignmentSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Religion",
        "Aesthetic",
        "Language",
      ],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TeachingAssignment",
  teachingAssignmentSchema
);