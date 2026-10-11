const mongoose = require("mongoose");

const subjectStatusSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    lessonDone: {
      type: Boolean,
      default: false,
    },

    reliefDone: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const periodSchema = new mongoose.Schema(
  {
    period: Number,

    category: String,

    isCategory: {
      type: Boolean,
      default: false,
    },

    subject: String,

    subjects: [
      {
        subject: String,
        lessonDone: {
          type: Boolean,
          default: false,
        },
        reliefDone: {
          type: Boolean,
          default: false,
        },
      },
    ],

    lessonDone: {
      type: Boolean,
      default: false,
    },

    reliefDone: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      unique: true,
    },

    Monday: {
      type: [periodSchema],
      required: true,
      validate: [(arr) => arr.length === 8, "Monday must have exactly 8 periods"],
    },

    Tuesday: {
      type: [periodSchema],
      required: true,
      validate: [(arr) => arr.length === 8, "Tuesday must have exactly 8 periods"],
    },

    Wednesday: {
      type: [periodSchema],
      required: true,
      validate: [(arr) => arr.length === 8, "Wednesday must have exactly 8 periods"],
    },

    Thursday: {
      type: [periodSchema],
      required: true,
      validate: [(arr) => arr.length === 8, "Thursday must have exactly 8 periods"],
    },

    Friday: {
      type: [periodSchema],
      required: true,
      validate: [(arr) => arr.length === 8, "Friday must have exactly 8 periods"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Timetable", timetableSchema);