const Timetable = require("../models/Timetable");
const User = require("../models/User");

const validSubjects = {
  General: [
    "Mathematics",
    "Science",
    "English",
    "Sinhala",
    "Tamil",
    "History",
    "Geography",
    "ICT",
    "Health",
    "Civic",
    "PTS",
    "Library",
    "Sports",
    "Free",
  ],

  Religion: [
    "Religion",
  ],

  Aesthetic: [
    "Aesthetic",
  ],

  Language: [
    "Language",
  ],
};

const validateDay = (periods) => {
  for (const period of periods) {
    if (!period.category || !period.subject) {
      throw new Error(
        `Category and Subject are required for Period ${period.period}`
      );
    }

    if (!validSubjects[period.category]) {
      throw new Error(
        `Invalid category: ${period.category}`
      );
    }

    if (
      !validSubjects[period.category].includes(period.subject)
    ) {
      throw new Error(
        `${period.subject} does not belong to ${period.category}`
      );
    }
  }
};

const createTimetable = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id);

    if (!teacher.classId) {
      return res.status(400).json({
        success: false,
        message: "No class has been assigned to you."
      });
    }

    const exists = await Timetable.findOne({
      classId: teacher.classId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Timetable already exists."
      });
    }

    validateDay(req.body.Monday);
validateDay(req.body.Tuesday);
validateDay(req.body.Wednesday);
validateDay(req.body.Thursday);
validateDay(req.body.Friday);

    const timetable = await Timetable.create({
      classId: teacher.classId,
      Monday: req.body.Monday,
      Tuesday: req.body.Tuesday,
      Wednesday: req.body.Wednesday,
      Thursday: req.body.Thursday,
      Friday: req.body.Friday,
    });

    teacher.firstLogin = false;
    await teacher.save();

    res.status(201).json({
      success: true,
      message: "Timetable created successfully.",
      data: timetable,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyTimetable = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id);

    const timetable = await Timetable.findOne({
      classId: teacher.classId,
    }).populate("classId");

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found.",
      });
    }

    res.json({
      success: true,
      data: timetable,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTimetable = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id);

    const timetable = await Timetable.findOne({
      classId: teacher.classId,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found.",
      });
    }
    validateDay(req.body.Monday);
validateDay(req.body.Tuesday);
validateDay(req.body.Wednesday);
validateDay(req.body.Thursday);
validateDay(req.body.Friday);

    timetable.Monday = req.body.Monday;
    timetable.Tuesday = req.body.Tuesday;
    timetable.Wednesday = req.body.Wednesday;
    timetable.Thursday = req.body.Thursday;
    timetable.Friday = req.body.Friday;

    await timetable.save();

    res.json({
      success: true,
      message: "Timetable updated successfully.",
      data: timetable,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodayTimetable = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id);

    const timetable = await Timetable.findOne({
      classId: teacher.classId,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found.",
      });
    }

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    res.json({
      success: true,
      day: today,
      periods: timetable[today],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTimetable,
  getMyTimetable,
  updateTimetable,
  getTodayTimetable,
};