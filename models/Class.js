const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 13,
    },

    section: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

classId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Class",
  default: null,
},

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", classSchema);