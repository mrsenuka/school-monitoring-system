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

const periodRecordSchema = new mongoose.Schema(
  {
    period: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    category: {
      type: String,
      required: true,
    },

    isCategory: {
      type: Boolean,
      default: false,
    },

    subject: {
      type: String,
      default: null,
    },

    subjects: {
      type: [subjectStatusSchema],
      default: [],
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
const lessonRecordSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      required: true,
    },

    periods: {
      type: [periodRecordSchema],
      validate: [(arr) => arr.length === 8, "Exactly 8 periods are required"],
    },
  },
  {
    timestamps: true,
  }
);

lessonRecordSchema.index(
  {
    classId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("LessonRecord", lessonRecordSchema);